import { NestFactory } from '@nestjs/core'
import { ConsumerFraudModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(ConsumerFraudModule)
	await app.listen(process.env.port ?? 3000)
}
bootstrap()
