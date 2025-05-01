import { Module } from '@nestjs/common'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { dataSourceOptionsFn } from '@libs/db/data-source'
import { rabbitmqConfigFn } from '@libs/config'

import { CreditAccountBalanceConsumerHandler } from './domains/accounts.transaction/credit-balance/credit-balance.consumer'
import { CreditAccountBalanceService } from './domains/accounts.transaction/credit-balance/credit-balance.service'

import { DebitAccountBalanceConsumerHandler } from './domains/accounts.transaction/debit-balance/debit-balance.consumer'
import { DebitAccountBalanceService } from './domains/accounts.transaction/debit-balance/debit-balance.service'

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
		CreditAccountBalanceConsumerHandler,
		CreditAccountBalanceService,

		DebitAccountBalanceConsumerHandler,
		DebitAccountBalanceService,
	],
})
export class AppModule {}
