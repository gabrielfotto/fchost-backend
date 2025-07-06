import { TInvoice } from '@libs/common/types'
import { EInvoiceStatus } from '@libs/common/enums'

export class InvoiceHelper {
	constructor(private invoice: TInvoice) {
		this.invoice = invoice
	}

	// process(): void {
	// 	if (this.invoice.amount > 10000) {
	// 		return
	// 	}

	// 	const random = Math.random()
	// 	const newStatus =
	// 		random <= 0.7 ? EInvoiceStatus.APPROVED : EInvoiceStatus.REJECTED

	// 	this.invoice.status = newStatus
	// }

	get data() {
		return this.invoice
	}
}
