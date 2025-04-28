import { Injectable } from '@nestjs/common'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { InjectRepository } from '@nestjs/typeorm'
import { In, IsNull, Repository } from 'typeorm'

import { ICronService } from './app.interfaces'
import {
	AccountEntity,
	AccountMachineEntity,
	MachineUsageEntity,
} from '@libs/db/entities'
import { differenceInMilliseconds } from 'date-fns'

@Injectable()
export class AppService implements ICronService {
	constructor(
		@InjectRepository(AccountEntity)
		private readonly accountsRepository: Repository<AccountEntity>,
		@InjectRepository(AccountMachineEntity)
		private readonly accountMachinesRepository: Repository<AccountMachineEntity>,
		@InjectRepository(MachineUsageEntity)
		private readonly machineUsagesRepository: Repository<MachineUsageEntity>,
		private readonly amqpConnection: AmqpConnection,
	) {}

	async execute() {
		const accounts = await this.accountsRepository.find()

		for (const account of accounts) {
			const accountMachines = await this.accountMachinesRepository.find({
				where: { account: { id: account.id } },
				relations: ['machine'],
			})

			if (!accountMachines.length) {
				continue
			}

			const accountMachineIds = accountMachines.map(am => am.id)
			const machineUsages = await this.machineUsagesRepository.find({
				where: [
					{
						accountMachine: { id: In(accountMachineIds) },
						lastProcessedAt: IsNull(),
					},
					{
						accountMachine: { id: In(accountMachineIds) },
						endedAt: IsNull(),
					},
				],
				relations: ['accountMachine'],
			})

			if (!machineUsages.length) {
				continue
			}

			let totalAccountUsageCost = 0
			const accountMachineMap = new Map(accountMachines.map(am => [am.id, am]))

			const usagePromises = machineUsages.map(async usage => {
				const accountMachine = accountMachineMap.get(usage.accountMachine.id)
				if (!accountMachine) {
					return
				}

				const usageStartedAt = usage.lastProcessedAt || usage.startedAt
				const usageEndedAt = usage.endedAt || new Date()

				const usageDiffInMs = differenceInMilliseconds(
					usageEndedAt,
					usageStartedAt,
				)

				const usageDiffInHours = usageDiffInMs / (1000 * 60 * 60)
				const usageCost = parseFloat(
					(usageDiffInHours * accountMachine.machine.pricePerHour).toFixed(4),
				)

				totalAccountUsageCost += usageCost
				const parsedUsageCost = parseFloat(usage.cost + usageCost).toFixed(4)

				usage.cost = parsedUsageCost
				usage.lastProcessedAt = new Date()

				return usage
			})

			const machineUsagesToUpdate = await Promise.all(usagePromises)
			const validMachineUsagesToUpdate = machineUsagesToUpdate.filter(
				(usage): usage is MachineUsageEntity => usage !== undefined,
			)

			await this.machineUsagesRepository.save(validMachineUsagesToUpdate)

			const message = {
				account_id: account.id,
				amount: parseFloat(totalAccountUsageCost.toFixed(4)),
			}

			await this.amqpConnection.publish(
				'fcpay',
				'accounts.balance.debit',
				message,
			)
		}
	}
}
