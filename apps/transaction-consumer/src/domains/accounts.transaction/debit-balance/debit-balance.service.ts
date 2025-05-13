import { Injectable, Logger } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

import { AccountEntity, TransactionEntity } from '@libs/db/entities'
import { DebitBalanceInputDTO } from './debit-balance.dtos'
import { ETransactionType } from '@libs/db/enums/transaction-type.enum'

@Injectable()
export class DebitAccountBalanceService {
	private readonly logger: Logger = new Logger(
		DebitAccountBalanceService.name,
		{
			timestamp: true,
		},
	)

	constructor(
		@InjectDataSource()
		private readonly dataSource: DataSource,
	) {}

	async execute(message: DebitBalanceInputDTO) {
		// . setar debitedAt para machine-usages
		const { account_id, amount } = message

		await this.dataSource.transaction(async manager => {
			const lockedAccount = await manager.findOne(AccountEntity, {
				where: { id: account_id },
				lock: { mode: 'pessimistic_write' },
			})

			if (!lockedAccount) {
				this.logger.warn(`Account ${account_id} not found`)
				return
			}

			if (lockedAccount.balance < amount) {
				this.logger.warn(`Insufficient balance`)
				return
			}

			const totalBalance = (
				parseFloat(lockedAccount.balance) - parseFloat(amount)
			).toFixed(4)

			lockedAccount.balance = totalBalance
			await manager.save(AccountEntity, lockedAccount)

			// save transaction
			const transaction = manager.create(TransactionEntity, {
				account: lockedAccount,
				type: ETransactionType.DEBIT,
				value: amount,
			})

			await manager.save(TransactionEntity, transaction)
		})
	}
}
