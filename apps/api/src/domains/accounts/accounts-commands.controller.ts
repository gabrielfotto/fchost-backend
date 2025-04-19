import { Body, Controller, Post } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { plainToInstance } from 'class-transformer'

import { Public } from '@api/shared/decorators'
import { CreateAccountInputDTO } from './commands/create-account/create-account.dtos'
import { CreateAccountCommand } from './commands/create-account/create-account.handler'

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
}
