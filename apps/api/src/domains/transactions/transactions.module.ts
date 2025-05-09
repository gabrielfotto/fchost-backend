import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'

import {
	AccountEntity,
	InvoiceEntity,
	TransactionEntity,
} from '@libs/db/entities'

import TransactionsQueriesController from './transactions-queries.controller'
// import InvoicesCommandsController from './transactions-commands.controller'

import TransactionsQueryHandlers from './queries'
// import InvoicesCommandHandlers from './commands'

@Module({
	imports: [
		CqrsModule,
		TypeOrmModule.forFeature([AccountEntity, InvoiceEntity, TransactionEntity]),
	],
	providers: [...TransactionsQueryHandlers],
	controllers: [TransactionsQueriesController],
})
export default class AccountsModule {}
