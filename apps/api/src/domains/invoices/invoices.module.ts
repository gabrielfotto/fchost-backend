import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'

import { AccountEntity, InvoiceEntity } from '@libs/db/entities'

import InvoicesQueriesController from './invoices-queries.controller'
import InvoicesCommandsController from './invoices-commands.controller'

import InvoicesQueryHandlers from './queries'
import InvoicesCommandHandlers from './commands'

@Module({
	imports: [
		CqrsModule,
		TypeOrmModule.forFeature([AccountEntity, InvoiceEntity]),
	],
	providers: [
		AmqpConnection,
		...InvoicesQueryHandlers,
		...InvoicesCommandHandlers,
	],
	controllers: [InvoicesCommandsController, InvoicesQueriesController],
})
export default class AccountsModule {}
