import { Module } from '@nestjs/common'

import { GlobalModule } from './global.module'

import { CreditAccountBalanceConsumerHandler } from './domains/accounts/credit-balance/credit-balance.consumer'
import { CreditAccountBalanceService } from './domains/accounts/credit-balance/credit-balance.service'

import { DebitAccountBalanceConsumerHandler } from './domains/accounts/debit-balance/debit-balance.consumer'
import { DebitAccountBalanceService } from './domains/accounts/debit-balance/debit-balance.service'

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
