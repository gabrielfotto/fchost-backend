import { IsEnum, IsNumber } from 'class-validator'
import { EMachineStatus } from '@libs/db/enums'

export class RegisterMachineUsageInputDTO {
	@IsNumber()
	machineId: number

	@IsEnum(EMachineStatus)
	machineStatus: EMachineStatus
}
