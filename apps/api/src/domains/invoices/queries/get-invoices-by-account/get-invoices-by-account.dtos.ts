import { Exclude, Expose } from 'class-transformer'
import { IsDefined } from 'class-validator'
import { EInvoiceStatus } from '@libs/shared/enums'

@Exclude()
export class GetInvoicesByAccountOutputDTO {
	@Expose()
	amount: string

	@Expose()
	description: string

	@Expose()
	paymentType: string

	@Expose()
	status: EInvoiceStatus

	@Expose()
	cardLast4Digits: string

	@IsDefined()
	@Expose()
	createdAt: string

	// @Expose()
	// test: boolean
}
