import { Injectable } from '@nestjs/common'
import { DataSource, In, IsNull } from 'typeorm'

import { ICronService } from '@libs/shared/interfaces'
import {
	AccountEntity,
	AccountMachineEntity,
	MachineUsageEntity,
} from '@libs/db/entities'
import { EMachineStatus } from '@libs/db/enums'

@Injectable()
export class CheckAccountBalanceService implements ICronService {
	private readonly ACCOUNT_BATCH_SIZE = 100

	constructor(private readonly dataSource: DataSource) {}

	async execute() {
		let skip = 0
		let hasMoreAccounts = true

		while (hasMoreAccounts) {
			const accounts = await this.dataSource.getRepository(AccountEntity).find({
				// @ts-ignore
				where: { balance: 0 },
				skip,
				take: this.ACCOUNT_BATCH_SIZE,
			})

			if (accounts.length === 0) {
				hasMoreAccounts = false
				break
			}

			await this.processAccountsBatch(accounts)

			skip += this.ACCOUNT_BATCH_SIZE
			hasMoreAccounts = accounts.length === this.ACCOUNT_BATCH_SIZE
		}
	}

	private async processAccountsBatch(accounts: AccountEntity[]) {
		for (const account of accounts) {
			await this.dataSource.transaction(async manager => {
				const accountMachines = await manager.find(AccountMachineEntity, {
					where: { status: EMachineStatus.ON, account: { id: account.id } },
					relations: ['machine'],
				})

				if (!accountMachines.length) {
					return
				}

				// Atualiza o status das máquinas para OFF
				const accountMachinePromises = accountMachines.map(
					async accountMachine => {
						accountMachine.status = EMachineStatus.OFF
						return accountMachine
					},
				)

				const accountMachinesToUpdate = await Promise.all(
					accountMachinePromises,
				)
				await manager.save(AccountMachineEntity, accountMachinesToUpdate)

				// Busca e atualiza os machine-usages ativos
				const machineUsages = await manager.find(MachineUsageEntity, {
					where: {
						accountMachine: { id: In(accountMachines.map(am => am.id)) },
						endedAt: IsNull(),
					},
				})

				if (machineUsages.length) {
					const now = new Date()
					const updatedMachineUsages = machineUsages.map(usage => {
						usage.endedAt = now
						return usage
					})

					await manager.save(MachineUsageEntity, updatedMachineUsages)
				}
			})
		}
	}
}
