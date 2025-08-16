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
	ram: number // GB

	@Expose()
	storage: number // GB

	@Expose()
	pricePerHour: number
}
