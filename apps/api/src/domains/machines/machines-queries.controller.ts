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

@Controller('transactions')
export default class TransactionsQueriesController {
	constructor(private readonly queryBus: QueryBus) {}
}
