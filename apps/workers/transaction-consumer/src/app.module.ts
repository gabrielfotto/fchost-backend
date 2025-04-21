import { Module } from '@nestjs/common'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { dataSourceOptionsFn } from '@libs/db/data-source'
import { rabbitmqConfigFn } from '@libs/config'

import { CreditAccountBalanceConsumer } from './domains/account/credit-balance.consumer'
import { CreditAccountBalanceService } from './domains/account/credit-balance.service'

import { DebitAccountBalanceConsumer } from './domains/account/debit-balance.consumer'
import { DebitAccountBalanceService } from './domains/account/debit-balance.service'

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) =>
				dataSourceOptionsFn(configService),
		}),

		RabbitMQModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) =>
				rabbitmqConfigFn(configService),
		}),
	],
	controllers: [],
	providers: [
		CreditAccountBalanceConsumer,
		CreditAccountBalanceService,
		DebitAccountBalanceConsumer,
		DebitAccountBalanceService,
	],
})
export class AppModule {}
