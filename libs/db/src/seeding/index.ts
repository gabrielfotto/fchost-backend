import { runSeeder } from 'typeorm-extension'

import { MainSeeder } from './seeder'
import dataSource from '../data-source'

dataSource.initialize().then(async () => {
	await dataSource.synchronize(true)
	await runSeeder(dataSource, MainSeeder)
})
