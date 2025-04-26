import { BadRequestException, Logger, NotFoundException } from '@nestjs/common'
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
	machineId: number
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
		const { account, machineId, machineStatus } = command

		if (machineStatus === EMachineStatus.ON && !account.balance) {
			throw new BadRequestException(`The account has not enough balance`)
		}

		await this.dataSource.transaction(async manager => {
			const accountMachineInsertResult =
				await manager.upsert<AccountMachineEntity>(
					AccountMachineEntity,
					{
						account,
						status: machineStatus,
						machine: {
							id: machineId,
						},
					},
					['account', 'machine'],
				)

			const accountMachine: AccountMachineEntity =
				accountMachineInsertResult.raw

			if (machineStatus === EMachineStatus.ON) {
				const machineUsageCreate = manager.create(MachineUsageEntity, {
					accountMachine,
					startedAt: new Date(),
				})

				await manager.save(MachineUsageEntity, machineUsageCreate)
			} else if (machineStatus === EMachineStatus.OFF) {
				const machineUsage = await manager.findOne(MachineUsageEntity, {
					where: { accountMachine, endedAt: IsNull() },
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
