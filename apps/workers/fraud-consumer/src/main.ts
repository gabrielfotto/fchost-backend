import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { AppModule } from './app.module'

async function bootstrap() {
	// const app = await NestFactory.createApplicationContext(AppModule)

	const invoices = await NestFactory.createMicroservice<MicroserviceOptions>(
		AppModule,
		{
			transport: Transport.RMQ,
			options: {
				urls: ['amqp://rabbitmq:rabbitmq@fcpay-rabbitmq:5672'],
				queue: 'invoices.fraud.detect',
				queueOptions: {
					durable: true,
					arguments: {
						'x-queue-type': 'quorum',
						'x-delivery-limit': 1,
					},
				},
			},
		},
	)

	invoices.listen()
}

bootstrap()
