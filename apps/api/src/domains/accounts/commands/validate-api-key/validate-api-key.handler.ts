import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { UnauthorizedException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'

import { AccountEntity } from '@libs/db/entities'
import {
	ValidateApiKeyInputDTO,
	ValidateApiKeyOutputDTO,
} from './validate-api-key.dtos'

export class ValidateApiKeyCommand {
	apiKey: string
}

@CommandHandler(ValidateApiKeyCommand)
export default class ValidateApiKeyCommandHandler
	implements ICommandHandler<ValidateApiKeyCommand, ValidateApiKeyOutputDTO>
{
	constructor(
		@InjectRepository(AccountEntity)
		private readonly accountsRepository: Repository<AccountEntity>,
	) {}

	async execute(
		command: ValidateApiKeyCommand,
	): Promise<ValidateApiKeyOutputDTO> {
		const { apiKey } = command

		const account = await this.accountsRepository.findOne({
			where: { apiKey },
		})

		if (!account) {
			throw new UnauthorizedException(`Invalid Api Key`)
		}

		return account
	}
}
