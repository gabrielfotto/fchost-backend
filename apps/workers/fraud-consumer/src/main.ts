import { NestFactory } from '@nestjs/core'
import { FraudConsumerModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.createApplicationContext(FraudConsumerModule)
}

bootstrap()
