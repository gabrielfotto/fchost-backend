import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

import AccountsQueriesController from './accounts-queries.controller'
import AccountsCommandsController from './accounts-commands.controller'

import AccountQueryHandlers from './queries'
import AccountCommandHandlers from './commands'

import { ProvidersModule } from '../..//providers/providers.module'

@Module({
	imports: [CqrsModule, ProvidersModule],
	providers: [...AccountQueryHandlers, ...AccountCommandHandlers],
	controllers: [AccountsQueriesController, AccountsCommandsController],
})
export default class AccountsModule {}
