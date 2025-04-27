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
	pricePerHour: number
}

@Exclude()
export class GetAccountMachinesOutputDTO {
	@Expose()
	id: number

	@Expose()
	status: EMachineStatus

	@Expose()
	@Type(() => MachineOutputDTO)
	machine: TMachine
}
