// import { Body, Controller, Post } from '@nestjs/common'
// import { CommandBus } from '@nestjs/cqrs'
// import { plainToInstance } from 'class-transformer'

// import { Account } from '@api/common/decorators/account.decorator'
// import { AccountEntity } from '@libs/db/entities'

// import { CreateInvoiceInputDTO } from './commands/create-invoice/create-invoice.dtos'
// import { CreateInvoiceCommand } from './commands/create-invoice/create-invoice.handler'

// @Controller('invoices')
// export default class InvoicesCommandsController {
// 	constructor(private readonly commandBus: CommandBus) {}

// 	@Post()
// 	async create(
// 		@Account() account: AccountEntity,
// 		@Body() dto: CreateInvoiceInputDTO,
// 	) {
// 		const command = plainToInstance(CreateInvoiceCommand, {
// 			...dto,
// 			account,
// 		})

// 		const invoice = await this.commandBus.execute(command)
// 		return invoice
// 	}
// }
