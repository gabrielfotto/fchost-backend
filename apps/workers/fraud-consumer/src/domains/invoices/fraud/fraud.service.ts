import { Injectable, Logger } from '@nestjs/common'
import { AmqpConnection, Nack } from '@golevelup/nestjs-rabbitmq'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'

import { InvoiceDTO } from './fraud.dtos'
import { AccountEntity, InvoiceEntity } from '@libs/db/entities'

import { FraudEspecificationAggregator } from './specifications'
import { FraudEntity } from '@libs/db/entities'
import { EInvoiceStatus } from '@libs/shared/enums'

@Injectable()
export class FraudConsumerService {
	private readonly logger: Logger = new Logger(FraudConsumerService.name, {
		timestamp: true,
	})

	constructor(
		@InjectDataSource()
		private readonly dataSource: DataSource,
		@InjectRepository(AccountEntity)
		private readonly accountRepository: Repository<AccountEntity>,
		@InjectRepository(InvoiceEntity)
		private readonly invoicesRepository: Repository<InvoiceEntity>,
		private readonly fraudEspecificationAggregator: FraudEspecificationAggregator,
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

		if (invoice.isProcessed) {
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

		const fraud = await this.fraudEspecificationAggregator.execute(
			account,
			amount,
		)

		await this.dataSource.transaction(async manager => {
			if (fraud) {
				await manager.create(FraudEntity, {
					invoice,
					reason: fraud.reason,
					description: fraud.description,
				})
			}

			invoice.status = fraud ? EInvoiceStatus.REJECTED : EInvoiceStatus.APPROVED
			invoice.isProcessed = true
			await manager.save(InvoiceEntity, invoice)
		})

		if (!fraud) {
			await this.amqpConnection.publish('default', 'transactions.credit', {})
		}
	}
}
