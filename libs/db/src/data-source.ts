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
	const isTsNode = currentDir.includes('node_modules/ts-node')

	// Se estiver rodando com ts-node, precisamos ajustar o caminho
	if (isTsNode) {
		currentDir = process.cwd()
	}

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

	// Usa findRoot para achar o diretório raiz do projeto
	const projectRoot = findRoot()

	// Detecta se já está rodando do dist
	const isDist = projectRoot.endsWith('dist')

	const basePath = isDist ? projectRoot : join(projectRoot, 'dist')
	const entitiesBase = join(basePath, 'libs', 'db', 'entities')
	const migrationsBase = join(basePath, 'libs', 'db', 'migrations')

	if (!existsSync(entitiesBase)) {
		throw new Error(`Entities path not found: ${entitiesBase}`)
	}

	if (!existsSync(migrationsBase)) {
		throw new Error(`Migrations path not found: ${migrationsBase}`)
	}

	let rdsSslCertOptions
	if (nodeEnv === 'prod') {
		rdsSslCertOptions = readCertFile(
			join(basePath, 'libs', 'db', 'cert', 'rds-us-east-1-bundle.pem'),
		)
	}

	return {
		type: 'postgres',
		host: dbHost,
		port: config.get('DB_PORT'),
		username: config.get('DB_USERNAME'),
		password: config.get('DB_PASSWORD'),
		database: config.get('DB_NAME'),
		// entities: [join(entitiesBase, '*.js')],
		entities: Entities,
		migrations: [join(migrationsBase, '*.js')],
		...(nodeEnv === 'prod'
			? {
					ssl: rdsSslCertOptions,
				}
			: {}),
	}
}

export function defaultConfigService() {
	return {
		get: (varName: string) => process.env[varName],
	}
}

const dataSource = new DataSource(
	dataSourceOptionsFn(defaultConfigService() as CustomConfigType),
)

export default dataSource
