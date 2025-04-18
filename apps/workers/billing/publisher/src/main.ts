import { NestFactory } from '@nestjs/core'
import { BillingPublisherModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.createApplicationContext(BillingPublisherModule)
}
bootstrap()
