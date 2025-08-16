import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'

import { AccountEntity, MachineEntity } from '../entities'

export class MainSeeder implements Seeder {
	public async run(
		dataSource: DataSource,
		factoryManager: SeederFactoryManager,
	): Promise<any> {
		const accountFactory = factoryManager.get(AccountEntity)
		const machineFactory = factoryManager.get(MachineEntity)

		const accounts = await Promise.all(
			Array(5)
				.fill(null)
				.map(() => accountFactory.make()),
		)

		const machines = await Promise.all(
			Array(4)
				.fill(null)
				.map(() => machineFactory.make()),
		)

		await dataSource.getRepository(AccountEntity).save(accounts)
		await dataSource.getRepository(MachineEntity).save(machines)
	}
}
