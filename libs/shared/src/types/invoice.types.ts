import { TAccount } from '../types'
import { EFraudReason, EInvoiceStatus } from '../enums'

export type TInvoice = {
	account: TAccount
	amount: string
	description: string
	paymentType: string
	status: EInvoiceStatus
	cardLast4Digits: string
	isFraudProcessed?: boolean
}

export type TFraud = {
	reason: EFraudReason
	description: string
}
