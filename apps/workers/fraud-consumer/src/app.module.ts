import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'

import { FraudConsumerQueues } from './app.queues'
import { FraudConsumerService } from './app.service'

import { dataSourceOptionsFn } from '@libs/db/data-source'
import { AccountEntity, InvoiceEntity } from '@libs/db/entities'

@Module({
	imports: [
		ConfigModule.forRoot(),

		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) =>
				dataSourceOptionsFn(configService),
		}),

		TypeOrmModule.forFeature([
			AccountEntity,
			InvoiceEntity,
			//
		]),

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
	],
	controllers: [],
	providers: [FraudConsumerQueues, FraudConsumerService],
})
export class FraudConsumerModule {}
