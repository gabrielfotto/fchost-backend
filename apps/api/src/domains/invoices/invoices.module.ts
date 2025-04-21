import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { AccountEntity, InvoiceEntity } from '@libs/db/entities'
import { rabbitmqConfigFn } from '@libs/config'

import InvoicesQueriesController from './invoices-queries.controller'
import InvoicesCommandsController from './invoices-commands.controller'

import InvoicesQueryHandlers from './queries'
import InvoicesCommandHandlers from './commands'

@Module({
	imports: [
		CqrsModule,
		TypeOrmModule.forFeature([AccountEntity, InvoiceEntity]),
		// RabbitMQModule.forRoot(rabbitmqConfig),
		RabbitMQModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) =>
				rabbitmqConfigFn(configService),
		}),
	],
	providers: [...InvoicesQueryHandlers, ...InvoicesCommandHandlers],
	controllers: [InvoicesCommandsController, InvoicesQueriesController],
})
export default class AccountsModule {}
