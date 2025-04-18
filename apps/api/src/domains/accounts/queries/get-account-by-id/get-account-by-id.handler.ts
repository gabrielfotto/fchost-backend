import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { plainToInstance } from 'class-transformer'

import { GetAccountOutputDTO } from './get-account-by-id.dtos'
import { AccountEntity } from '@libs/db/entities'

export class GetAccountQuery {
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
			return null
		}

		return plainToInstance(GetAccountOutputDTO, account)
	}
}
