import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { ConfigModule, ConfigService } from '@nestjs/config'

import {
	AccountEntity,
	AccountMachineEntity,
	InvoiceEntity,
	MachineEntity,
} from '@libs/db/entities'
import { rabbitmqConfigFn } from '@libs/config'

import MachinesQueriesController from './machines-queries.controller'
import MachinesCommandsController from './machines-commands.controller'

import MachinesQueryHandlers from './queries'
import MachinesCommandHandlers from './commands'

@Module({
	imports: [
		CqrsModule,
		TypeOrmModule.forFeature([
			AccountEntity,
			InvoiceEntity,
			MachineEntity,
			AccountMachineEntity,
		]),
		// RabbitMQModule.forRoot(rabbitmqConfig),
		RabbitMQModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) =>
				rabbitmqConfigFn(configService),
		}),
	],
	providers: [...MachinesQueryHandlers, ...MachinesCommandHandlers],
	controllers: [MachinesQueriesController, MachinesCommandsController],
})
export default class AccountsModule {}
