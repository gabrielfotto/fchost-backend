import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

import TransactionsQueriesController from './transactions-queries.controller'
// import InvoicesCommandsController from './transactions-commands.controller'

import TransactionsQueryHandlers from './queries'
// import InvoicesCommandHandlers from './commands'

@Module({
	imports: [CqrsModule],
	providers: [...TransactionsQueryHandlers],
	controllers: [TransactionsQueriesController],
})
export default class AccountsModule {}
