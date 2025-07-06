import { Injectable, Logger } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

import { CreditBalanceQueueInputDTO } from './credit-balance.dtos'
import {
	AccountEntity,
	InvoiceEntity,
	TransactionEntity,
} from '@libs/db/entities'
import { EInvoiceStatus } from '@libs/common/enums'
import { ETransactionType } from '@libs/db/enums/transaction-type.enum'

@Injectable()
export class CreditAccountBalanceQueueService {
	private readonly logger: Logger = new Logger(
		CreditAccountBalanceQueueService.name,
		{
			timestamp: true,
		},
	)

	constructor(
		@InjectDataSource()
		private readonly dataSource: DataSource,
	) {}

	async execute(message: CreditBalanceQueueInputDTO) {
		const { invoice_id } = message

		await this.dataSource.transaction(async manager => {
			const invoice = await manager.findOne(InvoiceEntity, {
				where: { id: invoice_id },
				relations: ['account'],
			})

			if (!invoice) {
				this.logger.warn(`Invoice ${invoice_id} not found`)
				return
			}

			const lockedAccount = await manager.findOne(AccountEntity, {
				where: { id: invoice.account.id },
				lock: { mode: 'pessimistic_write' },
			})

			if (!lockedAccount) {
				this.logger.warn(`Account ${invoice.account.id} not found`)
				return
			}

			const totalBalance = (
				parseFloat(lockedAccount.balance) + parseFloat(invoice.amount)
			).toFixed(4)

			lockedAccount.balance = totalBalance
			await manager.save(AccountEntity, lockedAccount)

			invoice.status = EInvoiceStatus.PROCESSED
			await manager.save(InvoiceEntity, invoice)

			// save transaction
			const transaction = manager.create(TransactionEntity, {
				account: lockedAccount,
				type: ETransactionType.CREDIT,
				value: invoice.amount,
				invoice,
			})

			await manager.save(TransactionEntity, transaction)
		})
	}
}
