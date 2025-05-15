import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'

import { AppModule } from './app.module'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.enableCors({
		origin: ['http://localhost:5173', 'https://fchost.ottodev.com.br'],
	})

	const config = new DocumentBuilder()
		.setTitle('FCHost')
		.setDescription('...')
		.setVersion('1.0.0')
		.addTag('fchost')
		.build()

	const documentFactory = () => SwaggerModule.createDocument(app, config)
	SwaggerModule.setup('swagger', app, documentFactory)
	await app.listen(8080)
}

bootstrap()
