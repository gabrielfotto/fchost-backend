import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { AccountEntity } from '@libs/db/entities'
import { CreateAccountInputDTO } from './create-account.dtos'

export class CreateAccountCommand {
	name: string
	email: string
	balance: number
}

@CommandHandler(CreateAccountCommand)
export default class CreateAccountCommandHandler
	implements ICommandHandler<CreateAccountCommand, CreateAccountInputDTO>
{
	constructor(
		@InjectRepository(AccountEntity)
		private readonly accountsRepository: Repository<AccountEntity>,
	) {}

	async execute(command: CreateAccountCommand): Promise<CreateAccountInputDTO> {
		const account = await this.accountsRepository.create(command)
		await this.accountsRepository.save(account)
		return account
	}
}
