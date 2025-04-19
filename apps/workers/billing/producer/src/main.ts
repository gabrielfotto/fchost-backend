import { NestFactory } from '@nestjs/core'
import { BillingProducerModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.createApplicationContext(BillingProducerModule)
}
bootstrap()
