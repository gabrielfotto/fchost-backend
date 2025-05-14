import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'

import AuthGuard from './guards/auth.guard'

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
	],
	controllers: [],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
})
export class AppModule {}
