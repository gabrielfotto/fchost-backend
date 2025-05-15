import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SESClient } from '@aws-sdk/client-ses'

import { HandlebarsEmailTemplateProvider } from './email-template/handlebars.provider'

@Module({
	providers: [
		{
			provide: 'AWS_SES_CLIENT',
			useFactory: (configService: ConfigService) =>
				new SESClient({
					region: configService.get('AWS_SES_REGION') || 'us-east-1',
					credentials: {
						accessKeyId: configService.get('AWS_SES_USER_ACCESS_KEY')!,
						secretAccessKey: configService.get(
							'AWS_SES_USER_SECRET_ACCESS_KEY',
						)!,
					},
				}),
		},
		{
			provide: 'HANDLEBARS_EMAIL_PROVIDER',
			useClass: HandlebarsEmailTemplateProvider,
		},
	],

	exports: ['HANDLEBARS_EMAIL_PROVIDER'],
})
export class ProvidersModule {}
