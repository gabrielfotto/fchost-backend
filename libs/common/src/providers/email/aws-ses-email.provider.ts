import { Inject, Injectable } from '@nestjs/common'
import { IEmailProvider } from './provider.models'

import {
	SESClient,
	SendEmailCommand,
	SendEmailCommandOutput,
} from '@aws-sdk/client-ses'

import { TSendEmailParams } from '../email/provider.models'
import { IEmailTemplateProvider } from '../email-template/provider.models'

@Injectable()
export class AWSSESEmailProvider
	implements IEmailProvider<SendEmailCommandOutput>
{
	constructor(
		@Inject('AWS_SES_CLIENT')
		private readonly client: SESClient,
		@Inject('HANDLEBARS_EMAIL_PROVIDER')
		private readonly emailTemplateProvider: IEmailTemplateProvider,
	) {}

	async send({
		to,
		from,
		subject,
		template,
	}: TSendEmailParams): Promise<SendEmailCommandOutput> {
		const templateData = await this.emailTemplateProvider.parse(template)

		const command = new SendEmailCommand({
			Destination: { ToAddresses: [to] },
			ReplyToAddresses: [from],
			Source: from,
			Message: {
				Subject: {
					Data: subject,
					Charset: 'utf-8',
				},
				Body: {
					Html: {
						Data: templateData,
						Charset: 'utf-8',
					},
				},
			},
		})

		return await this.client.send(command)
	}
}
