import GetMachinesQueryHandler from './get-machines/get-machines.handler'
import GetAccountMachinesQueryHandler from './get-account-machines/get-account-machines.handler'

const MachinesQueryHandlers: any = [
	GetMachinesQueryHandler,
	GetAccountMachinesQueryHandler,
]

export default MachinesQueryHandlers
