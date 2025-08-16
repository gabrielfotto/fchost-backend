import { DataSource, DataSourceOptions } from 'typeorm'
import { runSeeder, SeederOptions } from 'typeorm-extension'

import { MainSeeder } from './seeder'
import { dataSourceOptionsFn, defaultConfigService } from '../data-source'

import { AccountFactory, MachineFactory } from './factories'

const seederDataSourceOptions: DataSourceOptions & SeederOptions = {
	...dataSourceOptionsFn(defaultConfigService()),
	factories: [AccountFactory, MachineFactory],
	seeds: [MainSeeder],
}

const seederDataSource = new DataSource(seederDataSourceOptions)

seederDataSource.initialize().then(async () => {
	await seederDataSource.synchronize(true)
	await runSeeder(seederDataSource, MainSeeder)
})
