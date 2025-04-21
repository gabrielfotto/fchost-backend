import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'
// import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { AccountEntity, InvoiceEntity } from '@libs/db/entities'

import InvoicesQueriesController from './invoices-queries.controller'
import InvoicesCommandsController from './invoices-commands.controller'

import InvoicesQueryHandlers from './queries'
import InvoicesCommandHandlers from './commands'

@Module({
	imports: [
		CqrsModule,
		TypeOrmModule.forFeature([AccountEntity, InvoiceEntity]),

		ClientsModule.register([
			{
				name: 'INVOICE_SERVICE',
				transport: Transport.RMQ,
				options: {
					urls: ['amqp://rabbitmq:rabbitmq@fcpay-rabbitmq:5672'],
					queue: 'invoices.fraud.detect',
					queueOptions: {
						durable: true,
						arguments: {
							'x-queue-type': 'quorum',
							'x-delivery-limit': 1,
						},
					},
				},
			},
		]),
	],
	providers: [
		// AmqpConnection,
		...InvoicesQueryHandlers,
		...InvoicesCommandHandlers,
	],
	controllers: [InvoicesCommandsController, InvoicesQueriesController],
})
export default class AccountsModule {}
