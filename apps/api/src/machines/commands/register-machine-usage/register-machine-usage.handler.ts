import { Logger, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource, IsNull } from 'typeorm'

import {
	AccountEntity,
	MachineUsageEntity,
	AccountMachineEntity,
} from '@libs/db/entities'

import { EMachineStatus } from '@libs/db/enums'

export class RegisterMachineUsageCommand {
	account: AccountEntity
	accountMachineId: number
	machineStatus: EMachineStatus
}

@CommandHandler(RegisterMachineUsageCommand)
export default class RegisterMachineUsageCommandHandler
	implements ICommandHandler<RegisterMachineUsageCommand, void>
{
	private readonly logger: Logger = new Logger(
		RegisterMachineUsageCommandHandler.name,
		{
			timestamp: true,
		},
	)

	constructor(
		@InjectDataSource()
		private readonly dataSource: DataSource,
	) {}

	async execute(command: RegisterMachineUsageCommand): Promise<void> {
		const { account, accountMachineId, machineStatus } = command

		await this.dataSource.transaction(async manager => {
			const accountMachine = await manager.findOne(AccountMachineEntity, {
				where: { id: accountMachineId },
			})

			if (!accountMachine) {
				throw new NotFoundException(
					`Account machine ${accountMachineId} not found`,
				)
			}

			if (
				(machineStatus === EMachineStatus.ON &&
					accountMachine.status === EMachineStatus.ON) ||
				(machineStatus === EMachineStatus.OFF &&
					accountMachine.status === EMachineStatus.OFF)
			) {
				this.logger.warn(
					`Attempt to set the same current machine status: '${machineStatus}'`,
				)
				return
			}

			accountMachine.status = machineStatus
			await manager.save(AccountMachineEntity, accountMachine)

			if (machineStatus === EMachineStatus.ON) {
				const machineUsageCreate = manager.create(MachineUsageEntity, {
					accountMachine,
					startedAt: new Date(),
				})

				await manager.save(MachineUsageEntity, machineUsageCreate)
			} else if (machineStatus === EMachineStatus.OFF) {
				const machineUsage = await manager.findOne(MachineUsageEntity, {
					where: {
						accountMachine: { id: accountMachineId },
						endedAt: IsNull(),
					},
				})

				if (!machineUsage) {
					throw new NotFoundException(
						`Machine usage for account machine ${accountMachine.id} was not found`,
					)
				}

				machineUsage.endedAt = new Date()
				await manager.save(machineUsage)
			}
		})
	}
}
