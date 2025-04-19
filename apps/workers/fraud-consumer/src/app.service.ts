import { Injectable, Logger } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Nack } from '@golevelup/nestjs-rabbitmq'

import { InvoiceDTO } from './app.dtos'
import { AccountEntity, InvoiceEntity } from '@libs/db/entities'

@Injectable()
export class FraudConsumerService {
	private readonly logger: Logger = new Logger(FraudConsumerService.name, {
		timestamp: true,
	})

	constructor(
		@InjectRepository(AccountEntity)
		private readonly accountRepository: Repository<AccountEntity>,
		@InjectRepository(InvoiceEntity)
		private readonly invoicesRepository: Repository<InvoiceEntity>,
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

		if (account.isSuspicious) {
		}

		// invoice.fraudHistory = fraudHistory
		invoice.isProcessed = true
		await this.invoicesRepository.save(invoice)
	}
}
