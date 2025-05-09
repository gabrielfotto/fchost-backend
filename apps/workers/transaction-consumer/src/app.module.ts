import { Module } from '@nestjs/common'

import { CreditAccountBalanceConsumerHandler } from './domains/accounts.transaction/credit-balance/credit-balance.consumer'
import { CreditAccountBalanceService } from './domains/accounts.transaction/credit-balance/credit-balance.service'

import { DebitAccountBalanceConsumerHandler } from './domains/accounts.transaction/debit-balance/debit-balance.consumer'
import { DebitAccountBalanceService } from './domains/accounts.transaction/debit-balance/debit-balance.service'

import { GlobalModule } from './global.module'

@Module({
	imports: [GlobalModule],
	controllers: [],
	providers: [
		CreditAccountBalanceConsumerHandler,
		CreditAccountBalanceService,

		DebitAccountBalanceConsumerHandler,
		DebitAccountBalanceService,
	],
})
export class AppModule {}
