import { Exclude, Expose } from 'class-transformer'
import { IsDefined } from 'class-validator'
import { EInvoiceStatus } from '@libs/shared/enums'

@Exclude()
export class GetInvoicesByAccountOutputDTO {
	@Expose()
	amount: number

	@Expose()
	description: string

	@Expose()
	paymentType: string

	@Expose()
	status: EInvoiceStatus

	@Expose()
	cardLastDigits: string

	@IsDefined()
	@Expose()
	createdAt: string

	// @Expose()
	// test: boolean
}
