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

// função para rodar o comando de build para cada lib
function buildLibs() {
	const libs = getLibs()
	libs.forEach(lib => {
		const tsConfigPath = path.join(libsPath, lib, 'tsconfig.lib.json')
		if (fs.existsSync(tsConfigPath)) {
			console.log(`Building ${lib}...`)
			execSync(`tsc -p ${tsConfigPath}`, { stdio: 'inherit' })
		} else {
			console.log(`No tsconfig.lib.json found for ${lib}. Skipping...`)
		}
	})
}

buildLibs()
