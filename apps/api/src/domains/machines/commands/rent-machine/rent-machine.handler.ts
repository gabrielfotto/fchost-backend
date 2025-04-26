import { BadRequestException, Logger, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'

import {
	AccountEntity,
	MachineUsageEntity,
	AccountMachineEntity,
	MachineEntity,
} from '@libs/db/entities'

export class RentMachineCommand {
	account: AccountEntity
	machineId: number
}

@CommandHandler(RentMachineCommand)
export default class RentMachineCommandHandler
	implements ICommandHandler<RentMachineCommand, void>
{
	private readonly logger: Logger = new Logger(RentMachineCommandHandler.name, {
		timestamp: true,
	})

	constructor(
		// @InjectDataSource()
		// private readonly dataSource: DataSource,
		@InjectRepository(AccountMachineEntity)
		private readonly accountMachinesRepository: Repository<AccountMachineEntity>,
		@InjectRepository(MachineEntity)
		private readonly machinesRepository: Repository<MachineEntity>,
	) {}

	async execute(command: RentMachineCommand): Promise<void> {
		const { account, machineId } = command

		const machine = await this.machinesRepository.findOne({
			where: { id: machineId },
		})

		if (!machine) {
			throw new NotFoundException(`Machine ${machineId} not found`)
		}

		if (!account.balance) {
			throw new BadRequestException(`The account has not enough balance`)
		}

		const accountMachineCreate = this.accountMachinesRepository.create({
			account,
			machine,
		})

		await this.accountMachinesRepository.save(accountMachineCreate)
	}
}
