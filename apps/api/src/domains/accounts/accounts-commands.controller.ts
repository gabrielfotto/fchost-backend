import { Body, Controller, Post } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { plainToInstance } from 'class-transformer'

import { CreateAccountInputDTO } from './commands/create-account/create-account.dtos'
import { CreateAccountCommand } from './commands/create-account/create-account.handler'

@Controller('accounts')
export default class AccountsCommandsController {
	constructor(private readonly commandBus: CommandBus) {}

	@Post()
	async create(@Body() dto: CreateAccountInputDTO) {
		const command = plainToInstance(CreateAccountCommand, dto)
		const account = await this.commandBus.execute(command)
		return account
	}
}
