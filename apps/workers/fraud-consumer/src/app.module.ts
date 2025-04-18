import { Module } from '@nestjs/common'

import { FraudConsumerController } from './app.controller'
import { FraudConsumerService } from './app.service'

import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'

@Module({
	imports: [
		RabbitMQModule.forRoot({
			exchanges: [
				{
					name: 'exchange1',
					type: 'topic',
				},
			],
			uri: 'amqp://rabbitmq:rabbitmq@fcpay-rabbitmq:5672',
			connectionInitOptions: {
				wait: false,
			},
		}),
	],
	controllers: [],
	providers: [],
})
export class FraudConsumerModule {}
