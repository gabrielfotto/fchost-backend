import { Module } from '@nestjs/common'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'

@Module({
	imports: [
		// RabbitMQModule.forRoot({
		// 	uri: 'amqp://rabbitmq:rabbitmq@fcpay-rabbitmq:5672',
		// 	connectionInitOptions: {
		// 		wait: false,
		// 	},
		// 	exchanges: [
		// 		{
		// 			name: 'default',
		// 			type: 'topic',
		// 		},
		// 	],
		// 	channels: {
		// 		channel: {
		// 			default: true,
		// 			prefetchCount: 10,
		// 		},
		// 	},
		// }),

		SharedModule,
	],
	providers: [],
	exports: [SharedModule],
})
export default class SharedModule {}
