import { Injectable, Logger } from '@nestjs/common'
import { AmqpConnection, Nack } from '@golevelup/nestjs-rabbitmq'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

import { FraudDetectionInputDTO } from './fraud.dtos'
import { FraudSpecificationAggregator } from './specifications'

import { InvoiceEntity } from '@libs/db/entities'
import { FraudEntity } from '@libs/db/entities'
import { EInvoiceStatus } from '@libs/shared/enums'

@Injectable()
export class FraudDetectionConsumerHandlerService {
	private readonly logger: Logger = new Logger(
		FraudDetectionConsumerHandlerService.name,
		{
			timestamp: true,
		},
	)

	constructor(
		@InjectDataSource()
		private readonly dataSource: DataSource,
		private readonly fraudSpecificationAggregator: FraudSpecificationAggregator,
		private readonly amqpConnection: AmqpConnection,
	) {}

	async execute(message: FraudDetectionInputDTO) {
		const { invoice_id } = message

		await this.dataSource.transaction(async manager => {
			const invoice = await manager.findOneOrFail(InvoiceEntity, {
				where: { id: invoice_id },
				relations: ['account'],
			})

			if (!invoice) {
				this.logger.warn(`Invoice ${invoice_id} not found`)
				return new Nack()
			}

			if (invoice.isFraudProcessed) {
				this.logger.warn(`Invoice ${invoice_id} has already been processed`)
				return new Nack()
			}

			const fraudData = await this.fraudSpecificationAggregator.execute({
				account: invoice.account,
				amount: invoice.amount,
			})

			if (fraudData) {
				const fraud = manager.create(FraudEntity, {
					invoice,
					reason: fraudData.reason,
					description: fraudData.description,
				})

				await manager.save(FraudEntity, fraud)
				invoice.fraud = fraud
			}

			invoice.isFraudProcessed = true
			invoice.status = fraudData
				? EInvoiceStatus.REJECTED
				: EInvoiceStatus.APPROVED
			await manager.save(InvoiceEntity, invoice)

			if (!fraudData) {
				await this.amqpConnection.publish('fcpay', 'accounts.balance.credit', {
					invoice_id: invoice.id,
				})

				this.logger.debug(
					`Message sent to 'accounts.balance.credit': ${JSON.stringify(invoice)}`,
				)
			}
		})
	}
}
