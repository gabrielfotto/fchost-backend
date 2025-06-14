import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'

import AccountApiKeyGuard from './guards/account-api-key.guard'

import AccountsModule from './domains/accounts/accounts.module'
import InvoicesModule from './domains/invoices/invoices.module'
import MachinesModule from './domains/machines/machines.module'
import TransactionsModule from './domains/transactions/transactions.module'

import { GlobalModule } from './global.module'
import AuthModule from './domains/_auth/auth.module'

@Module({
	imports: [
		GlobalModule,

		AuthModule,
		AccountsModule,
		InvoicesModule,
		MachinesModule,
		TransactionsModule,
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
