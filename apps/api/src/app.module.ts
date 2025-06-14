import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { ThrottlerModule } from '@nestjs/throttler'

import AccountApiKeyGuard from './guards/account-api-key.guard'

import AccountsModule from './domains/accounts/accounts.module'
import InvoicesModule from './domains/invoices/invoices.module'
import MachinesModule from './domains/machines/machines.module'
import TransactionsModule from './domains/transactions/transactions.module'

import { GlobalModule } from './global.module'

@Module({
	imports: [
		GlobalModule,

		AccountsModule,
		InvoicesModule,
		MachinesModule,
		TransactionsModule,

		ThrottlerModule.forRoot({
			throttlers: [
				{
					ttl: 1000,
					limit: 5,
				},
			],
		}),
	],
	controllers: [],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AccountApiKeyGuard,
		},
	],
})
export class AppModule {}
