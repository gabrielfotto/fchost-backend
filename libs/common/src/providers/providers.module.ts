import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { SESClient } from '@aws-sdk/client-ses'

import { HandlebarsEmailTemplateProvider } from './email-template/handlebars.provider'

import { EmailProviders } from './email'

@Module({
	providers: [
		ConfigService,
		{
			provide: 'AWS_SES_CLIENT',
			inject: [ConfigService],
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

		...EmailProviders,
	],

	exports: ['HANDLEBARS_EMAIL_PROVIDER', ...EmailProviders],
})
export class ProvidersModule {}
