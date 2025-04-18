import { NestFactory } from '@nestjs/core'
import { ConsumerBillingModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(ConsumerBillingModule)
	await app.listen(process.env.port ?? 3000)
}
bootstrap()
