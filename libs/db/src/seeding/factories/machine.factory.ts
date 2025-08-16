import { setSeederFactory } from 'typeorm-extension'
import { MachineEntity } from '../../entities'

// Array de números disponíveis (de 20 a 100, de 10 em 10)
const availableNumbers = Array.from({ length: 9 }, (_, i) => (i + 2) * 10)

export const MachineFactory = setSeederFactory(MachineEntity, faker => {
	const machine = new MachineEntity()

	// Pega um número aleatório do array e remove ele
	const randomIndex = faker.number.int({
		min: 0,
		max: availableNumbers.length - 1,
	})

	const machineNumber = availableNumbers.splice(randomIndex, 1)[0]
	machine.name = `FC${machineNumber}`

	// Base resources that scale with machine number
	// vCPU and RAM are always multiples of 2
	machine.vcpu = Math.floor(machineNumber / 4) * 2 // FC10 will have 4 vCPUs
	machine.ram = Math.floor(machineNumber / 4) * 4 // FC10 will have 8GB RAM
	machine.storage = machineNumber * 5 // FC10 will have 50GB storage

	// Price per hour scales with total resources
	const basePrice = 0.065 // Base price per hour
	machine.pricePerHour = Number((basePrice * machineNumber).toFixed(4))

	return machine
})
