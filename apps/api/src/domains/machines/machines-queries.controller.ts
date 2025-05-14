import {
	Controller,
	DefaultValuePipe,
	Get,
	ParseIntPipe,
	Query,
} from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { plainToInstance } from 'class-transformer'

import { Account } from '@api/decorators/account.decorator'
import { AccountEntity } from '@libs/db/entities'

import { GetMachinesQuery } from './queries/get-machines/get-machines.handler'
import { GetAccountMachinesQuery } from './queries/get-account-machines/get-account-machines.handler'

@Controller('machines')
export default class TransactionsQueriesController {
	constructor(private readonly queryBus: QueryBus) {}

	@Get()
	async getAll(
		@Account() account: AccountEntity,
		@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
		@Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
	) {
		const query = plainToInstance(GetMachinesQuery, {
			account,
			page,
			limit,
		})

		const machines = await this.queryBus.execute(query)
		return machines
	}

	@Get('account')
	async getAccountMachines(
		@Account() account: AccountEntity,
		@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
		@Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
	) {
		const query = plainToInstance(GetAccountMachinesQuery, {
			account,
			page,
			limit,
		})

		const machines = await this.queryBus.execute(query)
		return machines
	}
}
