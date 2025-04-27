import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { AccountEntity } from '@libs/db/entities'
import {
	CreateAccountInputDTO,
	CreateAccountOutputDTO,
} from './create-account.dtos'

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

		const account = await this.accountsRepository.create({
			name,
			email,
		})

		// usar shared/utils dto para validar dados
		await this.accountsRepository.save(account)
		return account
	}
}
