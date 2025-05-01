import { Exclude, Expose } from 'class-transformer'
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

	@Expose()
	createdAt: string

	// @Expose()
	// test: boolean
}
