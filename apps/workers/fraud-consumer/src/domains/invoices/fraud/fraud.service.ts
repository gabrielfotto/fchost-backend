import { Injectable, Logger } from '@nestjs/common'
import { Nack } from '@golevelup/nestjs-rabbitmq'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'

import { InvoiceDTO } from './fraud.dtos'
import { AccountEntity, InvoiceEntity } from '@libs/db/entities'

import FraudHistoryEntity from '@libs/db/entities/fraud-history.entity'
import { FraudEspecificationAggregator } from './specifications'

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
		private readonly fraudEspecification: FraudEspecificationAggregator,
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

		const fraud = await this.fraudEspecification.execute(account, amount)
		await this.dataSource.transaction(async manager => {
			if (fraud) {
				await manager.create(FraudHistoryEntity, {
					invoice,
					reason: fraud.reason,
					description: fraud.description,
				})
			}

			invoice.isProcessed = true
			await manager.save(InvoiceEntity, invoice)
		})
	}
}
