import { IsEnum, IsNumber } from 'class-validator'
import { EMachineStatus } from '@libs/db/enums'

export class RegisterMachineUsageInputDTO {
	@IsNumber()
	accountMachineId: number

	@IsEnum(EMachineStatus)
	machineStatus: EMachineStatus
}
