const fs = require('fs')
const path = require('path')
const execSync = require('child_process').execSync

// Caminho para a pasta das libs
const libsPath = path.join(__dirname, '..', 'libs')

// Função para buscar todas as libs na pasta
function getLibs() {
	return fs.readdirSync(libsPath).filter(lib => {
		const libPath = path.join(libsPath, lib)
		return fs.lstatSync(libPath).isDirectory()
	})
}

// Função para rodar o comando de build para cada lib
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

// Rodando o build para todas as libs
buildLibs()
