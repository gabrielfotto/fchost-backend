import { Body, Controller, Headers, Post } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { plainToInstance } from 'class-transformer'

import { Public } from '@api/decorators'

import { CreateAccountInputDTO } from './commands/create-account/create-account.dtos'
import { CreateAccountCommand } from './commands/create-account/create-account.handler'

import { ValidateApiKeyInputDTO } from './commands/validate-api-key/validate-api-key.dtos'
import { ValidateApiKeyCommand } from './commands/validate-api-key/validate-api-key.handler'

@Controller('accounts')
export default class AccountsCommandsController {
	constructor(private readonly commandBus: CommandBus) {}

	@Public()
	@Post()
	async create(@Body() dto: CreateAccountInputDTO) {
		const command = plainToInstance(CreateAccountCommand, dto)
		const account = await this.commandBus.execute(command)
		return account
	}

	@Public()
	@Post('api-key/validate')
	async validateApiKey(@Headers('X-Api-Key') apiKey: string) {
		const command = plainToInstance(ValidateApiKeyCommand, { apiKey })
		const account = await this.commandBus.execute(command)
		return account
	}
}
