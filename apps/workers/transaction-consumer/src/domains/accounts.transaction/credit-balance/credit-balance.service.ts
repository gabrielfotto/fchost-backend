import { Injectable, Logger } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

import { CreditBalanceInputDTO } from './credit-balance.dtos'
import {
	AccountEntity,
	InvoiceEntity,
	TransactionEntity,
} from '@libs/db/entities'
import { EInvoiceStatus } from '@libs/shared/enums'
import { ETransactionType } from '@libs/db/enums/transaction-type.enum'

@Injectable()
export class CreditAccountBalanceService {
	private readonly logger: Logger = new Logger(
		CreditAccountBalanceService.name,
		{
			timestamp: true,
		},
	)

	constructor(
		@InjectDataSource()
		private readonly dataSource: DataSource,
	) {}

	async execute(message: CreditBalanceInputDTO) {
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

			const transactionValue = invoice.amount

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
