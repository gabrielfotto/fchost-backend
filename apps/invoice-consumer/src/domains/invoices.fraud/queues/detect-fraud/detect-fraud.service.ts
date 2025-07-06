import { Injectable, Logger } from '@nestjs/common'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

import {
	FraudDetectionQueueInputDTO,
	FraudDetectionQueueOutputDTO,
} from './detect-fraud.dtos'
import { FraudSpecificationAggregator } from './specifications'

import { InvoiceEntity } from '@libs/db/entities'
import { FraudEntity } from '@libs/db/entities'
import { EInvoiceStatus } from '@libs/common/enums'

@Injectable()
export class FraudDetectionQueueConsumerHandlerService {
	private readonly logger: Logger = new Logger(
		FraudDetectionQueueConsumerHandlerService.name,
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

	async execute(message: FraudDetectionQueueInputDTO) {
		const { invoice_id } = message

		const invoice = await this.dataSource.transaction<
			FraudDetectionQueueOutputDTO | undefined
		>(async manager => {
			const invoice = await manager.findOne(InvoiceEntity, {
				where: { id: invoice_id },
				relations: ['account'],
			})

			if (!invoice) {
				this.logger.warn(`Invoice ${invoice_id} not found`)
				return
			}

			if (invoice.isFraudProcessed) {
				this.logger.warn(`Invoice ${invoice_id} has already been processed`)
				return
			}

			const fraudData = await this.fraudSpecificationAggregator.execute({
				account: invoice.account,
				amount: invoice.amount,
			})

			if (fraudData) {
				const fraudCreate = manager.create(FraudEntity, {
					invoice,
					reason: fraudData.reason,
					description: fraudData.description,
				})

				const fraud = await manager.save(FraudEntity, fraudCreate)
				invoice.fraud = fraud
			}

			invoice.isFraudProcessed = true
			invoice.status = fraudData
				? EInvoiceStatus.REJECTED
				: EInvoiceStatus.APPROVED

			await manager.save(InvoiceEntity, invoice)
			return invoice
		})

		if (invoice && !invoice.fraud) {
			const message = { invoice_id: invoice.id }

			await this.amqpConnection.publish(
				'fchost',
				'accounts.balance.credit',
				message,
			)

			this.logger.debug(
				`Message sent to 'accounts.balance.credit': ${JSON.stringify(message)}`,
			)
		}
	}
}
