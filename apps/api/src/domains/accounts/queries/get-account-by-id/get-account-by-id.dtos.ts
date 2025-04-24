import { Exclude, Expose } from 'class-transformer'

@Exclude()
export class GetAccountOutputDTO {
	@Expose()
	id: string

	@Expose()
	name: string

	@Expose()
	email: string

	@Expose()
	balance: string
}
