import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { plainToInstance } from 'class-transformer'

import { AccountEntity } from '@libs/db/entities'

export class LoginQuery {
	accountId: number
	id: number
}

@QueryHandler(LoginQuery)
export default class LoginQueryHandler
	implements IQueryHandler<LoginQuery, any | null>
{
	constructor(
		@InjectRepository(AccountEntity)
		private readonly accountsRepository: Repository<AccountEntity>,
	) {}

	async execute(query: LoginQuery): Promise<any | null> {}
}
