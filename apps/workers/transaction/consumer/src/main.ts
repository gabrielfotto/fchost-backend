import { NestFactory } from '@nestjs/core'
import { TransactionConsumerModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.createApplicationContext(
		TransactionConsumerModule,
	)
}

bootstrap()
