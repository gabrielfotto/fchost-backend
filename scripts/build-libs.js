const fs = require('fs')
const path = require('path')
const execSync = require('child_process').execSync

// caminho para a pasta das libs
const libsPath = path.join(__dirname, '..', 'libs')

// função para buscar todas as libs
function getLibs() {
	return fs.readdirSync(libsPath).filter(lib => {
		const libPath = path.join(libsPath, lib)
		return fs.lstatSync(libPath).isDirectory()
	})
}

function copyStaticFiles(libName) {
	const libSrcPath = path.join(libsPath, libName, 'src')
	const libDistPath = path.join(__dirname, '..', 'dist', 'libs', libName)

	const copyConfig = [
		{ lib: 'db', items: ['cert'] },
		// adicione outras libs se necessário
	]

	const config = copyConfig.find(cfg => cfg.lib === libName)
	if (!config) return

	config.items.forEach(item => {
		const srcPath = path.join(libSrcPath, item)
		const destPath = path.join(libDistPath, item)

		if (!fs.existsSync(srcPath)) {
			console.warn(
				`🔸 [${libName}] Pasta ou arquivo estático "${item}" não encontrado em: ${srcPath}`,
			)
			return
		}

		try {
			fs.mkdirSync(path.dirname(destPath), { recursive: true })
			fs.cpSync(srcPath, destPath, { recursive: true })
			console.log(`✅ [${libName}] Copied: ${item} → ${destPath}`)
		} catch (err) {
			console.error(`❌ Erro ao copiar ${item} para ${destPath}:`, err)
		}
	})
}

// função para rodar o comando de build para cada lib
function buildLibs() {
	const libs = getLibs()
	libs.forEach(lib => {
		const tsConfigPath = path.join(libsPath, lib, 'tsconfig.lib.json')
		if (fs.existsSync(tsConfigPath)) {
			console.log(`Building ${lib}...`)
			execSync(`tsc -p ${tsConfigPath}`, { stdio: 'inherit' })
			copyStaticFiles(lib)
		} else {
			console.log(`No tsconfig.lib.json found for ${lib}. Skipping...`)
		}
	})
}

buildLibs()
