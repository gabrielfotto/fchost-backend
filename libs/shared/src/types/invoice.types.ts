import { TAccount } from '../types'
import { EFraudReason, EInvoiceStatus } from '../enums'

export type TInvoice = {
	account: TAccount
	amount: number
	description: string
	paymentType: string
	status: EInvoiceStatus
	cardLastDigits: string
}

export type TFraudHistory = {
	reason: EFraudReason
	description: string
}
