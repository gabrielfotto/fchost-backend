import { Injectable, Logger } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

import { AccountEntity } from '@libs/db/entities'
import { DebitBalanceInputDTO } from './debit-balance.dtos'

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
		const { account, amount } = message

		await this.dataSource.transaction(async manager => {
			const lockedAccount = await manager.findOne(AccountEntity, {
				where: { id: account.id },
				lock: { mode: 'pessimistic_write' },
			})

			if (!lockedAccount) {
				this.logger.warn(`Account ${account.id} not found`)
				return
			}

			if (lockedAccount.balance < amount) {
				this.logger.warn(`Insufficient balance`)
				return
			}

			lockedAccount.balance -= amount
			await manager.save(AccountEntity, lockedAccount)
		})
	}
}
