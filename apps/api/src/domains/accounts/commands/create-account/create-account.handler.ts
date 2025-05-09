import { Repository } from 'typeorm'
import { BadRequestException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { plainToInstance } from 'class-transformer'

import { AccountEntity } from '@libs/db/entities'
import { CreateAccountOutputDTO } from './create-account.dtos'

export class CreateAccountCommand {
	name: string
	email: string
	// balance: string
}

@CommandHandler(CreateAccountCommand)
export default class CreateAccountCommandHandler
	implements ICommandHandler<CreateAccountCommand, CreateAccountOutputDTO>
{
	constructor(
		@InjectRepository(AccountEntity)
		private readonly accountsRepository: Repository<AccountEntity>,
	) {}

	async execute(
		command: CreateAccountCommand,
	): Promise<CreateAccountOutputDTO> {
		const { name, email } = command

		const dbAccount = await this.accountsRepository.findOne({
			where: {
				email,
			},
		})

		if (dbAccount) {
			throw new BadRequestException(`Email already used`)
		}

		const account = await this.accountsRepository.create({
			name,
			email,
		})

		// usar shared/utils dto para validar dados
		await this.accountsRepository.save(account)

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

		return transformedAccount
	}
}
