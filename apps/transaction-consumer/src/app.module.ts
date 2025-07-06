import { Module } from '@nestjs/common'

import { GlobalModule } from './global.module'

import { CreditAccountBalanceQueueConsumerHandler } from './domains/accounts/queues/credit-balance/credit-balance.consumer'
import { CreditAccountBalanceQueueService } from './domains/accounts/queues/credit-balance/credit-balance.service'

import { DebitAccountBalanceQueueConsumerHandler } from './domains/accounts/queues/debit-balance/debit-balance.consumer'
import { DebitAccountBalanceQueueService } from './domains/accounts/queues/debit-balance/debit-balance.service'

@Module({
	imports: [GlobalModule],
	controllers: [],
	providers: [
		CreditAccountBalanceQueueConsumerHandler,
		CreditAccountBalanceQueueService,

		DebitAccountBalanceQueueConsumerHandler,
		DebitAccountBalanceQueueService,
	],
})
export class AppModule {}
