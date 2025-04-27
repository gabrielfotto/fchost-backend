import { Exclude, Expose } from 'class-transformer'

export class ValidateApiKeyInputDTO {}

@Exclude()
export class ValidateApiKeyOutputDTO {
	@Expose()
	name: string

	@Expose()
	email: string

	@Expose()
	balance: string

	@Expose()
	apiKey: string
}
