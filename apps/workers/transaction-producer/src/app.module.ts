import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { dataSourceOptionsFn } from '@libs/db/data-source'
import { rabbitmqConfigFn } from '@libs/config'

import { AppCron } from './app.cron'
import { AppService } from './app.service'
import {
	AccountEntity,
	AccountMachineEntity,
	InvoiceEntity,
	MachineEntity,
	MachineUsageEntity,
} from '@libs/db/entities'

@Module({
	imports: [
		ScheduleModule.forRoot(),

		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) =>
				dataSourceOptionsFn(configService),
		}),

		TypeOrmModule.forFeature([
			AccountEntity,
			// MachineEntity,
			MachineUsageEntity,
			AccountMachineEntity,
		]),

		RabbitMQModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) =>
				rabbitmqConfigFn(configService),
		}),
	],
	controllers: [],
	providers: [AppCron, AppService],
})
export class AppModule {}
