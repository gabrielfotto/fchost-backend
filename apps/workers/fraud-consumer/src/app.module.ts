import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'

import { dataSourceOptionsFn } from '@libs/db/data-source'
import FraudModule from './domains/invoices/fraud/fraud.module'

@Module({
	imports: [
		ConfigModule.forRoot(),

		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) =>
				dataSourceOptionsFn(configService),
		}),

		RabbitMQModule.forRoot({
			exchanges: [
				{
					name: 'default',
					type: 'topic',
				},
			],
			uri: 'amqp://rabbitmq:rabbitmq@fcpay-rabbitmq:5672',
			// connectionInitOptions: {
			// 	wait: false,
			// },
		}),

		FraudModule,
	],
	controllers: [],
	providers: [],
})
export class FraudConsumerModule {}
