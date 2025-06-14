import { DataSource } from 'typeorm'
import { Seeder, SeederFactoryManager } from 'typeorm-extension'
import { faker } from '@faker-js/faker'

import { MachineEntity } from '../entities'

export class MainSeeder implements Seeder {
	public async run(
		dataSource: DataSource,
		factoryManager: SeederFactoryManager,
	): Promise<any> {
		const machines = Array(4)
			.fill(null)
			.map(() => {
				const machine = new MachineEntity()
				const machineNumber = faker.number.int({ min: 1, max: 10 }) * 10
				machine.name = `FC${machineNumber}`

				// Base resources that scale with machine number
				// vCPU and RAM are always multiples of 2
				machine.vcpu = Math.floor(machineNumber / 2) * 2 // FC10 will have 10 vCPUs
				machine.ram = Math.floor(machineNumber / 2) * 4 // FC10 will have 20GB RAM
				machine.storage = machineNumber * 20 // FC10 will have 200GB storage

				// Price per hour scales with total resources
				const basePrice = 0.25 // Base price per hour
				machine.pricePerHour = Number((basePrice * machineNumber).toFixed(4))

				return machine
			})

		await dataSource.getRepository(MachineEntity).save(machines)
	}
}
