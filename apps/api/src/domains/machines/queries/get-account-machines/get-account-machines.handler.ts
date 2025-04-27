import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { plainToInstance } from 'class-transformer'

import { AccountEntity, AccountMachineEntity } from '@libs/db/entities'
import { TPaginationMeta } from '@api/shared/types/pagination.types'

import { PaginationResponseDTO } from '@api/shared/dtos/pagination.dtos'
import { GetAccountMachinesOutputDTO } from './get-account-machines.dtos'

export class GetAccountMachinesQuery {
	account: AccountEntity

	// pagination
	page: number
	limit: number
}

@QueryHandler(GetAccountMachinesQuery)
export default class GetAccountMachinesQueryHandler
	implements
		IQueryHandler<
			GetAccountMachinesQuery,
			PaginationResponseDTO<GetAccountMachinesOutputDTO>
		>
{
	constructor(
		@InjectRepository(AccountMachineEntity)
		private readonly accountMachinesRepository: Repository<AccountMachineEntity>,
	) {}

	async execute(
		query: GetAccountMachinesQuery,
	): Promise<PaginationResponseDTO<GetAccountMachinesOutputDTO>> {
		const { account, page, limit } = query

		// Calcula o offset (quantos itens pular)
		const skip = (page - 1) * limit

		const [accountMachines, totalItems] =
			await this.accountMachinesRepository.findAndCount({
				skip,
				take: limit,
				order: {
					createdAt: 'DESC',
				},
				relations: ['machine'],
			})

		const transformedAccountMachines = plainToInstance(
			GetAccountMachinesOutputDTO,
			accountMachines,
			{
				excludeExtraneousValues: true,
			},
		)

		// Calcula os metadados da paginação
		const totalPages = Math.ceil(totalItems / limit)
		const count = accountMachines.length

		const meta: TPaginationMeta = {
			totalItems,
			count,
			itemsPerPage: limit,
			totalPages,
			currentPage: page,
		}

		// Cria e retorna a resposta paginada
		return new PaginationResponseDTO<GetAccountMachinesOutputDTO>(
			transformedAccountMachines,
			meta,
		)
	}
}
