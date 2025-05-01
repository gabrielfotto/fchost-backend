import { Exclude, Expose } from 'class-transformer'

@Exclude()
export class GetTransactionsByAccountOutputDTO {
	@Expose()
	type: string

	@Expose()
	value: string

	@Expose()
	invoice: string

	@Expose()
	createdAt: string
}
