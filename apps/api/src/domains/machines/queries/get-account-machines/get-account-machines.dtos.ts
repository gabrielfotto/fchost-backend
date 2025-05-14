import { Exclude, Expose, Type } from 'class-transformer'
import { EMachineStatus } from '@libs/db/enums'
import { TMachine } from '@libs/shared/types'

@Exclude()
export class MachineOutputDTO {
	@Expose()
	name: string

	@Expose()
	vcpu: string

	@Expose()
	ram: string

	@Expose()
	storage: string

	@Expose()
	pricePerHour: number
}

@Exclude()
export class GetAccountMachinesOutputDTO {
	@Expose()
	id: number

	@Expose()
	status: EMachineStatus

	@Expose()
	totalUsageCost: number

	@Expose()
	totalUsageHours: number

	@Expose()
	@Type(() => MachineOutputDTO)
	machine: TMachine
}
