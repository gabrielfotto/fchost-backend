import { DataSource } from 'typeorm'
import { ConfigService } from '@nestjs/config'
import { BadRequestException } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { plainToInstance } from 'class-transformer'

import { AccountEntity } from '@libs/db/entities'
import { CreateAccountOutputDTO } from './create-account.dtos'

import { AWSSESEmailProvider } from '../../../../providers/email/aws-ses-email.provider'

export class CreateAccountCommand {
	name: string
	email: string
}

@CommandHandler(CreateAccountCommand)
export default class CreateAccountCommandHandler
	implements ICommandHandler<CreateAccountCommand, CreateAccountOutputDTO>
{
	constructor(
		@InjectDataSource()
		private readonly dataSource: DataSource,
		private readonly awsSESEmailProvider: AWSSESEmailProvider,
		private readonly configService: ConfigService,
	) {}

	async execute(
		command: CreateAccountCommand,
	): Promise<CreateAccountOutputDTO> {
		const { name, email } = command

		const transformedAccount = await this.dataSource.transaction(
			async manager => {
				const dbAccount = await manager.findOne(AccountEntity, {
					where: {
						email,
					},
				})

				if (dbAccount) {
					throw new BadRequestException(`Email already used`)
				}

				const account = await manager.create(AccountEntity, {
					name,
					email,
				})

				// usar shared/utils dto para validar dados
				await manager.save(AccountEntity, account)

				const transformedAccount = plainToInstance(
					CreateAccountOutputDTO,
					account,
					{
						// Importante: Garante que apenas propriedades com @Expose() sejam incluídas
						// e que transformações padrão sejam aplicadas.

						// se eu quiser que seja lançado um erro,
						// precisarei criar um interceptor usando o util plain-to-instance-and-validate.utils
						excludeExtraneousValues: true,
					},
				)

				const sourceEmail = `"FCHost" <${this.configService.get('APP_EMAIL_SOURCE')}>`
				await this.awsSESEmailProvider.send({
					to: email,
					from: sourceEmail,
					subject: 'API Key',
					template: {
						file: 'accounts.create-account',
						variables: {
							name,
							apiKey: account.apiKey,
						},
					},
				})

				return transformedAccount
			},
		)

		return transformedAccount
	}
}
