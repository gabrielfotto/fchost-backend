import { Body, Controller, Param, Post } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { plainToInstance } from 'class-transformer'

import { Account } from '@api/shared/decorators/account.decorator'
import { AccountEntity } from '@libs/db/entities'

import { RentMachineInputDTO } from './commands/rent-machine/rent-machine.dtos'
import { RentMachineCommand } from './commands/rent-machine/rent-machine.handler'

import { RegisterMachineUsageInputDTO } from './commands/register-machine-usage/register-machine-usage.dtos'
import { RegisterMachineUsageCommand } from './commands/register-machine-usage/register-machine-usage.handler'

@Controller('machines')
export default class MachinesCommandsController {
	constructor(private readonly commandBus: CommandBus) {}

	@Post(':id/rent')
	async rent(
		@Account() account: AccountEntity,
		@Param('id') machineId: number,
	) {
		const command = plainToInstance(RentMachineCommand, {
			machineId,
			account,
		})

		const machineUsage = await this.commandBus.execute(command)
		return machineUsage
	}

	@Post('usage/register')
	async registerUsage(
		@Account() account: AccountEntity,
		@Body() dto: RegisterMachineUsageInputDTO,
	) {
		const command = plainToInstance(RegisterMachineUsageCommand, {
			...dto,
			account,
		})

		const machineUsage = await this.commandBus.execute(command)
		return machineUsage
	}
}
