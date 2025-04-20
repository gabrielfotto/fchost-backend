import { NestFactory } from '@nestjs/core'
import { TransactionProducerModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.createApplicationContext(
		TransactionProducerModule,
	)
}
bootstrap()
