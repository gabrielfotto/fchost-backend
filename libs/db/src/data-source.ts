import 'dotenv/config'

import { readFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'

import { DataSource, DataSourceOptions } from 'typeorm'
import { ConfigService } from '@nestjs/config'

import Entities from './entities'

type CustomConfigType = {
	get: (varName: string) => any
}

function resolveValidPath(primary: string, fallback: string): string {
	return existsSync(primary) ? primary : fallback
}

function getProjectRootDir(): string {
	return dirname(require.main?.filename || process.cwd())
}

function readCertFile(certPath: string) {
	try {
		const cert = readFileSync(certPath)
		return {
			ca: cert.toString(),
			rejectUnauthorized: true,
		}
	} catch (error) {
		console.warn(`⚠️ Certificado SSL não pôde ser lido em: ${certPath}`)
		console.warn(error)
	}
}

export function findRoot(startDir: string = __dirname): string {
	let currentDir = startDir

	while (
		!existsSync(join(currentDir, 'libs')) &&
		dirname(currentDir) !== currentDir
	) {
		currentDir = dirname(currentDir)
	}

	return currentDir
}

export function dataSourceOptionsFn(
	config: CustomConfigType | ConfigService,
): DataSourceOptions {
	const nodeEnv = config.get('NODE_ENV')
	let dbHost = config.get('DB_HOST')

	if (!(config instanceof ConfigService) && nodeEnv === 'dev') {
		dbHost = 'localhost'
	}

	// Usa findRoot para achar o dist/libs independente da estrutura
	const distRoot = findRoot()

	let rdsSslCertOptions
	if (nodeEnv === 'prod') {
		rdsSslCertOptions = readCertFile(
			join(distRoot, 'libs', 'db', 'cert', 'rds-us-east-1-bundle.pem'),
		)
	}

	const baseWithLibs = join(distRoot, 'libs', 'db')
	const baseWithoutLibs = join(distRoot, 'db')

	const entitiesBase = resolveValidPath(
		join(baseWithLibs, 'entities'),
		join(baseWithoutLibs, 'entities'),
	)

	const migrationsBase = resolveValidPath(
		join(baseWithLibs, 'migrations'),
		join(baseWithoutLibs, 'migrations'),
	)

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
		// entities: [join(entitiesBase, '*.entity.js')],
		entities: [...Entities],
		migrations: [join(migrationsBase, '*.js')],
		...(nodeEnv === 'prod'
			? {
					ssl: rdsSslCertOptions,
				}
			: {}),
	}
}

const dataSource = new DataSource(
	dataSourceOptionsFn({
		get: (varName: string) => process.env[varName],
	}),
)

export default dataSource
