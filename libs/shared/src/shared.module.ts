import { Module } from '@nestjs/common'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'

@Module({
	imports: [
		// RabbitMQModule.forRoot({
		// 	exchanges: [
		// 		{
		// 			name: 'default',
		// 			type: 'topic',
		// 		},
		// 	],
		// 	uri: 'amqp://rabbitmq:rabbitmq@fcpay-rabbitmq:5672',
		// 	connectionInitOptions: {
		// 		wait: false,
		// 	},
		// }),
	],
	providers: [],
	exports: [],
})
export default class SharedModule {}
