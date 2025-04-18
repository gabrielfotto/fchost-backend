import { NestFactory } from '@nestjs/core'
import { BillingConsumerModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.createApplicationContext(BillingConsumerModule)
}

bootstrap()
