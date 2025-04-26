import { IsNumber } from 'class-validator'

export class RentMachineInputDTO {
	@IsNumber()
	machineId: number
}
