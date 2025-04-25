import AccountEntity from './account.entity'
import InvoiceEntity from './invoice.entity'
import FraudEntity from './invoice-fraud.entity'
import TransactionEntity from './transaction.entity'
import MachinesEntity from './machine.entity'
import AccountMachineEntity from './account-machine.entity'

const Entities = [
	AccountEntity,
	InvoiceEntity,
	FraudEntity,
	TransactionEntity,
	MachinesEntity,
	AccountMachineEntity,
]

export {
	AccountEntity,
	InvoiceEntity,
	FraudEntity,
	TransactionEntity,
	MachinesEntity,
	AccountMachineEntity,
}

export default Entities
