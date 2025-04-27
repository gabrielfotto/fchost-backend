import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { plainToInstance } from 'class-transformer'

import { GetAccountOutputDTO } from './get-account-by-id.dtos'
import { AccountEntity } from '@libs/db/entities'

export class GetAccountQuery {
	accountId: number
	id: number
}

@QueryHandler(GetAccountQuery)
export default class GetAccountQueryHandler
	implements IQueryHandler<GetAccountQuery, GetAccountOutputDTO | null>
{
	constructor(
		@InjectRepository(AccountEntity)
		private readonly accountsRepository: Repository<AccountEntity>,
	) {}

	async execute(query: GetAccountQuery): Promise<GetAccountOutputDTO | null> {
		const account = await this.accountsRepository.findOneBy({
			id: query.id,
		})

		if (!account) {
			throw new NotFoundException('Account not found')
		}

		if (account.id !== query.accountId) {
			throw new ForbiddenException()
		}

		return plainToInstance(GetAccountOutputDTO, account, {
			excludeExtraneousValues: true,
		})
	}
}
