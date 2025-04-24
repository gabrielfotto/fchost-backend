import { Injectable, Logger } from '@nestjs/common'
import { AmqpConnection, Nack } from '@golevelup/nestjs-rabbitmq'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'

import { FraudDetectionInputDTO } from './fraud.dtos'
import { FraudSpecificationAggregator } from './specifications'

import { AccountEntity, InvoiceEntity } from '@libs/db/entities'
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
		// @InjectRepository(AccountEntity)
		// private readonly accountRepository: Repository<AccountEntity>,
		// @InjectRepository(InvoiceEntity)
		// private readonly invoicesRepository: Repository<InvoiceEntity>,
		private readonly fraudSpecificationAggregator: FraudSpecificationAggregator,
		private readonly amqpConnection: AmqpConnection,
	) {}

	async execute(message: FraudDetectionInputDTO) {
		const { invoice_id, account_id } = message

		await this.dataSource.transaction(async manager => {
			const invoice = await manager.findOneByOrFail(InvoiceEntity, {
				id: invoice_id,
			})

			if (!invoice) {
				this.logger.warn(`Invoice ${invoice_id} not found`)
				return new Nack()
			}

			if (invoice.isFraudProcessed) {
				this.logger.warn(`Invoice ${invoice_id} has already been processed`)
				return new Nack()
			}

			const account = await manager.findOneByOrFail(AccountEntity, {
				id: account_id,
			})

			if (!account) {
				this.logger.warn(`Account ${account_id} not found`)
				return new Nack()
			}

			const fraudData = await this.fraudSpecificationAggregator.execute({
				account,
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
					account_id: account.id,
					invoice_id: invoice.id,
				})

				this.logger.debug(
					`Message sent to 'accounts.balance.credit': ${JSON.stringify(invoice)}`,
				)
			}
		})
	}
}
