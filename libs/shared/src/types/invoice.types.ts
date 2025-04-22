import { TAccount } from '../types'
import { EFraudReason, EInvoiceStatus } from '../enums'

export type TInvoice = {
	account: TAccount
	amount: number
	description: string
	paymentType: string
	status: EInvoiceStatus
	cardLastDigits: string
	isFraudProcessed?: boolean
}

export type TFraud = {
	reason: EFraudReason
	description: string
}
