import GetInvoiceByIdQueryHandler from './get-invoice-by-id/get-invoice-by-id.handler'
import GetInvoicesByAccountQueryHandler from './get-invoices-by-account/get-invoices-by-account.handler'

const InvoiceQueryHandlers: any = [
	GetInvoiceByIdQueryHandler,
	GetInvoicesByAccountQueryHandler,
]

export default InvoiceQueryHandlers
