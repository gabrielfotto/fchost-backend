import { Body, Controller, Post } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { plainToInstance } from 'class-transformer'

import { Account } from '@api/shared/decorators/account.decorator'
import { AccountEntity } from '@libs/db/entities'

import { RegisterMachineUsageInputDTO } from './commands/register-machine-usage/register-machine-usage.dtos'
import RegisterMachineUsageCommandHandler from './commands/register-machine-usage/register-machine-usage.handler'

@Controller('machines')
export default class MachinesCommandsController {
	constructor(private readonly commandBus: CommandBus) {}

	@Post('usage')
	async create(
		@Account() account: AccountEntity,
		@Body() dto: RegisterMachineUsageInputDTO,
	) {
		const command = plainToInstance(RegisterMachineUsageCommandHandler, {
			...dto,
			account,
		})

		const machineUsage = await this.commandBus.execute(command)
		return machineUsage
	}
}
