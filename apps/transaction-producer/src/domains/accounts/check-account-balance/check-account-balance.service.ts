import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { ICronService } from '../../../app.interfaces'
import { AccountEntity, AccountMachineEntity } from '@libs/db/entities'
import { EMachineStatus } from '@libs/db/enums'

@Injectable()
export class CheckAccountBalanceService implements ICronService {
	constructor(
		@InjectRepository(AccountEntity)
		private readonly accountsRepository: Repository<AccountEntity>,
		@InjectRepository(AccountMachineEntity)
		private readonly accountMachinesRepository: Repository<AccountMachineEntity>,
	) {}

	async execute() {
		const accounts = await this.accountsRepository.find({
			// @ts-ignore
			where: { balance: 0 },
		})

		for (const account of accounts) {
			const accountMachines = await this.accountMachinesRepository.find({
				where: { account: { id: account.id } },
				relations: ['machine'],
			})

			if (!accountMachines.length) {
				continue
			}

			const accountMachinePromises = accountMachines.map(
				async accountMachine => {
					accountMachine.status = EMachineStatus.OFF
					return accountMachine
				},
			)

			const accountMachinesToUpdate = await Promise.all(accountMachinePromises)
			await this.accountMachinesRepository.save(accountMachinesToUpdate)
		}
	}
}
