import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'

import { AccountEntity } from '@libs/db/entities'

import AccountsQueriesController from './accounts-queries.controller'
import AccountsCommandsController from './accounts-commands.controller'

import AccountQueryHandlers from './queries'
import AccountCommandHandlers from './commands'

@Module({
	imports: [CqrsModule, TypeOrmModule.forFeature([AccountEntity])],
	providers: [...AccountQueryHandlers, ...AccountCommandHandlers],
	controllers: [AccountsQueriesController, AccountsCommandsController],
})
export default class AccountsModule {}
