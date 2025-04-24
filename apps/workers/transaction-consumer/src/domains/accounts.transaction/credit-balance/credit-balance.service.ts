import { Injectable, Logger } from '@nestjs/common'
import { Nack } from '@golevelup/nestjs-rabbitmq'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

import { CreditBalanceInputDTO } from './credit-balance.dtos'
import { AccountEntity, InvoiceEntity } from '@libs/db/entities'

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
			const invoice = await manager.findOneOrFail(InvoiceEntity, {
				where: { id: invoice_id },
				relations: ['account'],
			})

			if (!invoice) {
				this.logger.warn(`Invoice ${invoice_id} not found`)
				return new Nack()
			}

			const lockedAccount = await manager.findOne(AccountEntity, {
				where: { id: invoice.account.id },
				lock: { mode: 'pessimistic_write' },
			})

			if (!lockedAccount) {
				this.logger.warn(`Account ${invoice.account.id} not found`)
				return new Nack()
			}

			const totalBalance =
				Number(lockedAccount.balance) + Number(invoice.amount)

			lockedAccount.balance = String(totalBalance)
			await manager.save(AccountEntity, lockedAccount)
		})
	}
}
