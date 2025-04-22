import { Injectable, Logger } from '@nestjs/common'
import { AmqpConnection, Nack } from '@golevelup/nestjs-rabbitmq'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'

import { InvoiceDTO } from './fraud.dtos'
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
		@InjectRepository(AccountEntity)
		private readonly accountRepository: Repository<AccountEntity>,
		@InjectRepository(InvoiceEntity)
		private readonly invoicesRepository: Repository<InvoiceEntity>,
		private readonly fraudSpecificationAggregator: FraudSpecificationAggregator,
		private readonly amqpConnection: AmqpConnection,
	) {}

	async execute(payload: InvoiceDTO) {
		const { invoice_id, account_id, amount } = payload

		const invoice = await this.invoicesRepository.findOneBy({
			id: invoice_id,
		})

		if (!invoice) {
			this.logger.warn(`Invoice ${invoice_id} not found`)
			return new Nack()
		}

		if (invoice.fraud) {
			this.logger.warn(`Invoice ${invoice_id} has already been processed`)
			return new Nack()
		}

		const account = await this.accountRepository.findOneBy({
			id: account_id,
		})

		if (!account) {
			this.logger.warn(`Account ${account_id} not found`)
			return new Nack()
		}

		const fraudData = await this.fraudSpecificationAggregator.execute({
			account,
			amount,
		})

		await this.dataSource.transaction(async manager => {
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
					...invoice,
				})

				this.logger.debug(
					`Message sent to 'accounts.balance.credit': ${JSON.stringify(invoice)}`,
				)
			}

			return invoice
		})
	}
}
