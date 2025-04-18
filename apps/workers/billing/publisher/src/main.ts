import { NestFactory } from '@nestjs/core'
import { PublisherBillingModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(PublisherBillingModule)
	await app.listen(process.env.port ?? 3000)
}
bootstrap()
