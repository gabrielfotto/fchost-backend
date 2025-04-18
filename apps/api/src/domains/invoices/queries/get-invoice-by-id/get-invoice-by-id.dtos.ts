import { Exclude, Expose } from 'class-transformer'
import { EInvoiceStatus } from '@libs/shared/enums'

@Exclude()
export class GetInvoiceByIdOutputDTO {
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
}
