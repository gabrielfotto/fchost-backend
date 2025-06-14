import { DataSource } from 'typeorm'
import { BadRequestException } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { plainToInstance } from 'class-transformer'

import { AccountEntity } from '@libs/db/entities'
import { ValidateAccountOutputDTO } from './validate-account.dtos'

import { AWSSESEmailProvider } from '@libs/shared/providers/email/aws-ses-email.provider'

export class ValidateAccountCommand {
	name: string
	email: string
}

@CommandHandler(ValidateAccountCommand)
export default class ValidateAccountCommandHandler
	implements ICommandHandler<ValidateAccountCommand, ValidateAccountOutputDTO>
{
	constructor(
		@InjectDataSource()
		private readonly dataSource: DataSource,
		private readonly awsSESEmailProvider: AWSSESEmailProvider,
	) {}

	async execute(
		command: ValidateAccountCommand,
	): Promise<ValidateAccountOutputDTO> {
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

				await manager.save(AccountEntity, account)
				const transformedAccount = plainToInstance(
					ValidateAccountOutputDTO,
					account,
					{
						excludeExtraneousValues: true,
					},
				)

				return transformedAccount
			},
		)

		return transformedAccount
	}
}
