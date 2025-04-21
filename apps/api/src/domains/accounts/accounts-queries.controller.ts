import { Controller, Get, Param } from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { plainToInstance } from 'class-transformer'

import { GetAccountQuery } from './queries/get-account-by-id/get-account-by-id.handler'
import { Account } from '@api/shared/decorators'

@Controller('accounts')
export default class AccountsQueriesController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get(':id')
	async findById(@Account('id') accountId, @Param('id') id: string) {
		const query = plainToInstance(GetAccountQuery, {
			accountId,
			id: Number(id),
		})

		const account = await this.queryBus.execute(query)
		return account
	}
}
