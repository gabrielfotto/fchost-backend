import { Exclude, Expose } from 'class-transformer'
import { EInvoiceStatus } from '@libs/common/enums'

@Exclude()
export class GetInvoiceByIdOutputDTO {
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
}
