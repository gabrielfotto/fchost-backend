import AccountEntity from './account.entity'
import InvoiceEntity from './invoice.entity'
import FraudEntity from './invoice-fraud.entity'
import TransactionEntity from './transaction.entity'
import MachineEntity from './machine.entity'
import AccountMachineEntity from './account-machine.entity'
import MachineUsage from './machine-usage.entity'

const Entities = [
	AccountEntity,
	InvoiceEntity,
	FraudEntity,
	TransactionEntity,
	MachineEntity,
	AccountMachineEntity,
	MachineUsage,
]

export {
	AccountEntity,
	InvoiceEntity,
	FraudEntity,
	TransactionEntity,
	MachineEntity,
	AccountMachineEntity,
	MachineUsage,
}

export default Entities
