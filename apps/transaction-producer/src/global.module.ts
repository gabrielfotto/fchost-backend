import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'

import { dataSourceOptionsFn } from '@libs/db/data-source'
import { rabbitmqConfigFn } from '@libs/config'

import {
	AccountEntity,
	AccountMachineEntity,
	MachineUsageEntity,
} from '@libs/db/entities'

@Global()
@Module({
	imports: [
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
	exports: [TypeOrmModule, RabbitMQModule],
})
export class GlobalModule {}
