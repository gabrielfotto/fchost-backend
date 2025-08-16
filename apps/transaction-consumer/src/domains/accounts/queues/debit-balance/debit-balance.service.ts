import { Injectable, Logger } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

import { AccountEntity, TransactionEntity } from '@libs/db/entities'
import { DebitBalanceQueueInputDTO } from './debit-balance.dtos'
import { ETransactionType } from '@libs/db/enums/transaction-type.enum'

@Injectable()
export class DebitAccountBalanceQueueService {
	private readonly logger: Logger = new Logger(
		DebitAccountBalanceQueueService.name,
		{
			timestamp: true,
		},
	)

	constructor(
		@InjectDataSource()
		private readonly dataSource: DataSource,
	) {}

	async execute(message: DebitBalanceQueueInputDTO) {
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

			if (lockedAccount.balance === '0') {
				this.logger.debug(`Account ${account_id}: balance is 0`)
				return
			}

			if (lockedAccount.balance < amount) {
				lockedAccount.balance = '0'
				await manager.save(AccountEntity, lockedAccount)

				this.logger.warn(
					`Account ${account_id}: balance updated to 0 due to insufficient balance`,
				)

				return
			}

			const totalBalance = (
				Number(lockedAccount.balance) - Number(amount)
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
