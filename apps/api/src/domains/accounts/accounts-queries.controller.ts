import { Controller, Get, NotFoundException, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { plainToInstance } from 'class-transformer'

import { GetAccountQuery } from './queries/get-account-by-id/get-account-by-id.handler'

@Controller('accounts')
export default class AccountsQueriesController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get(':id')
	async findById(@Param('id') id: string) {
		const query = plainToInstance(GetAccountQuery, {
			id: Number(id),
		})

		const account = await this.queryBus.execute(query)
		if (!account) {
			throw new NotFoundException('Account not found')
		}

		return account
	}
}
