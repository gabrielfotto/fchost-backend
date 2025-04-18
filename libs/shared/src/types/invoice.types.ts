import { TAccount } from '../types'
import { EInvoiceStatus } from '../enums'

export type TInvoice = {
	account: TAccount
	amount: number
	description: string
	paymentType: string
	status: EInvoiceStatus
	cardLastDigits: string
}
