import { Exclude, Expose } from 'class-transformer'

@Exclude()
export class GetMachinesOutputDTO {
	@Expose()
	id: number

	@Expose()
	name: string

	@Expose()
	vcpu: number

	@Expose()
	ram: number // MB

	@Expose()
	pricePerHour: number
}
