import {
	Controller,
	DefaultValuePipe,
	Get,
	Param,
	ParseIntPipe,
	Query,
} from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { plainToInstance } from 'class-transformer'

import { Account } from '@api/shared/decorators/account.decorator'
import { AccountEntity } from '@libs/db/entities'

// import { GetInvoiceByIdOutputDTO } from './queries/get-invoice-by-id/get-invoice-by-id.dtos'
import { GetTransactionsByAccountQuery } from './queries/get-transactions-by-account/get-transactions-by-account.handler'

@Controller('transactions')
export default class TransactionsQueriesController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get()
	async getByAccount(
		@Account() account: AccountEntity,
		@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
		@Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
	) {
		const query = plainToInstance(GetTransactionsByAccountQuery, {
			account,
			page,
			limit,
		})

		const invoices = await this.queryBus.execute(query)
		return invoices
	}

	// @Get(':id')
	// async getById(@Account() account: AccountEntity, @Param('id') id: string) {
	// 	const query = plainToInstance(GetInvoiceByIdOutputDTO, {
	// 		account,
	// 		id: Number(id),
	// 	})

	// 	const invoice = await this.queryBus.execute(query)
	// 	return invoice
	// }
}
