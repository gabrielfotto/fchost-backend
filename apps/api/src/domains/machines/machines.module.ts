import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

import MachinesQueriesController from './machines-queries.controller'
import MachinesCommandsController from './machines-commands.controller'

import MachinesQueryHandlers from './queries'
import MachinesCommandHandlers from './commands'

@Module({
	imports: [CqrsModule],
	providers: [...MachinesQueryHandlers, ...MachinesCommandHandlers],
	controllers: [MachinesQueriesController, MachinesCommandsController],
})
export default class AccountsModule {}
