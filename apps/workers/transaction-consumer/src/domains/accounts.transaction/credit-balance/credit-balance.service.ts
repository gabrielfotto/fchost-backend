import { Injectable, Logger } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

import { CreditBalanceInputDTO } from './credit-balance.dtos'
import { AccountEntity } from '@libs/db/entities'

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

			lockedAccount.balance += amount
			await manager.save(AccountEntity, lockedAccount)
		})
	}
}
