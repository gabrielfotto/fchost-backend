import { Global, Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'

import { rabbitmqConfigFn } from '@libs/config'
import { dataSourceOptionsFn } from '@libs/db/data-source'
import {
	AccountEntity,
	AccountMachineEntity,
	InvoiceEntity,
	MachineEntity,
	TransactionEntity,
} from '@libs/db/entities'

import constantsConfig from './app.constants'

// this global module is used to ensure the application has only one connection
// for rabbitmq, and one connection postgres database
@Global()
@Module({
	imports: [
		CqrsModule,
		ConfigModule.forRoot({
			isGlobal: true,
			load: [constantsConfig],
		}),

		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) =>
				dataSourceOptionsFn(configService),
		}),

		TypeOrmModule.forFeature([
			AccountEntity,
			InvoiceEntity,
			MachineEntity,
			TransactionEntity,
			AccountMachineEntity,
			//
		]),

		RabbitMQModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) =>
				rabbitmqConfigFn(configService),
		}),
	],
	controllers: [],
	exports: [TypeOrmModule, RabbitMQModule],
})
export class GlobalModule {}
