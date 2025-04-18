import { Module } from '@nestjs/common'
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
			uri: 'amqp://rabbitmq:rabbitmq@localhost:5672',
			connectionInitOptions: {
				wait: false,
			},
		}),
	],
	controllers: [],
	providers: [],
})
export class BillingConsumerModule {}
