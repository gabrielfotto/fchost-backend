import 'dotenv/config'

import { existsSync } from 'fs'
import { join } from 'path'

import { DataSource, DataSourceOptions } from 'typeorm'
import { ConfigService } from '@nestjs/config'

import Entities from './entities'

type CustomConfigType = {
	get: (varName: string) => any
}

function resolveValidPath(primary: string, fallback: string): string {
	return existsSync(primary) ? primary : fallback
}

export function dataSourceOptionsFn(
	config: CustomConfigType | ConfigService,
): DataSourceOptions {
	const nodeEnv = config.get('NODE_ENV')
	let dbHost = config.get('DB_HOST')

	if (!(config instanceof ConfigService) && nodeEnv === 'dev') {
		dbHost = 'localhost'
	} else if (config instanceof ConfigService && nodeEnv === 'dev') {
		// dbHost = 'fcpay-postgres'
	}

	// Caminhos possíveis
	const baseWithLibs = join(__dirname, '..', '..', 'libs', 'db', 'src')
	const baseWithoutLibs = join(__dirname, '..', '..', 'db', 'src')

	// Resolvendo caminhos reais
	const entitiesBase = resolveValidPath(
		join(baseWithLibs, 'entities'),
		join(baseWithoutLibs, 'entities'),
	)

	const migrationsBase = resolveValidPath(
		join(baseWithLibs, 'migrations'),
		join(baseWithoutLibs, 'migrations'),
	)

	// Logs de debug opcionais
	if (!existsSync(entitiesBase)) {
		throw new Error(`Entities path not found: ${entitiesBase}`)
	}

	if (!existsSync(migrationsBase)) {
		throw new Error(`Migrations path not found: ${migrationsBase}`)
	}

	return {
		type: 'postgres',
		host: dbHost,
		port: config.get('DB_PORT'),
		username: config.get('DB_USERNAME'),
		password: config.get('DB_PASSWORD'),
		database: config.get('DB_NAME'),
		entities: [...Entities],
		migrations: [join(migrationsBase, '*.js')],
	}
}

const dataSource = new DataSource(
	dataSourceOptionsFn({
		get: (varName: string) => process.env[varName],
	}),
)

export default dataSource
