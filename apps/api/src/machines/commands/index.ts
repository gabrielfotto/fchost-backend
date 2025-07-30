import RentMachineCommandHandler from './rent-machine/rent-machine.handler'
import RegisterMachineUsageCommandHandler from './register-machine-usage/register-machine-usage.handler'

const MachinesCommandHandlers: any = [
	RentMachineCommandHandler,
	RegisterMachineUsageCommandHandler,
]

export default MachinesCommandHandlers
