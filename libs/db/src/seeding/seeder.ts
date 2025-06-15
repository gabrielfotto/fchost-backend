import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'

import { MachineEntity } from '../entities'

export class MainSeeder implements Seeder {
	public async run(
		dataSource: DataSource,
		factoryManager: SeederFactoryManager,
	): Promise<any> {
		const machineFactory = factoryManager.get(MachineEntity)

		const machines = await Promise.all(
			Array(4)
				.fill(null)
				.map(async () => await machineFactory.make()),
		)

		await dataSource.getRepository(MachineEntity).save(machines)
	}
}
