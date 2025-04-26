import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { plainToInstance } from 'class-transformer'

import { GetMachinesOutputDTO } from './get-machines.dtos'

import { AccountEntity, MachineEntity } from '@libs/db/entities'
import { TPaginationMeta } from '@api/shared/types/pagination.types'
import { PaginationResponseDTO } from '@api/shared/dtos/pagination.dtos'

export class GetMachinesQuery {
	account: AccountEntity

	// pagination
	page: number
	limit: number
}

@QueryHandler(GetMachinesQuery)
export default class GetMachinesQueryHandler
	implements
		IQueryHandler<GetMachinesQuery, PaginationResponseDTO<GetMachinesOutputDTO>>
{
	constructor(
		@InjectRepository(MachineEntity)
		private readonly machinesRepository: Repository<MachineEntity>,
	) {}

	async execute(
		query: GetMachinesQuery,
	): Promise<PaginationResponseDTO<GetMachinesOutputDTO>> {
		const { account, page, limit } = query

		// Calcula o offset (quantos itens pular)
		const skip = (page - 1) * limit

		const [machines, totalItems] = await this.machinesRepository.findAndCount({
			skip,
			take: limit,
			order: {
				createdAt: 'DESC',
			},
		})

		const transformedMachines = plainToInstance(
			GetMachinesOutputDTO,
			machines,
			{
				excludeExtraneousValues: true,
			},
		)

		// Calcula os metadados da paginação
		const totalPages = Math.ceil(totalItems / limit)
		const count = machines.length

		const meta: TPaginationMeta = {
			totalItems,
			count,
			itemsPerPage: limit,
			totalPages,
			currentPage: page,
		}

		// Cria e retorna a resposta paginada
		return new PaginationResponseDTO<GetMachinesOutputDTO>(
			transformedMachines,
			meta,
		)
	}
}
