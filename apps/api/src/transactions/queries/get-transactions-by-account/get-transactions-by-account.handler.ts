import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { plainToInstance } from 'class-transformer'

import { PaginationResponseDTO } from '@api/_common/dtos/pagination.dtos'
import { TPaginationMeta } from '@api/_common/types/pagination.types'
// import { plainToInstanceAndValidate } from '@api/common/utils/plain-to-instance-and-validate.utils'

import { GetTransactionsByAccountOutputDTO } from './get-transactions-by-account.dtos'

import { AccountEntity, TransactionEntity } from '@libs/db/entities'

export class GetTransactionsByAccountQuery {
	account: AccountEntity

	// pagination
	page: number
	limit: number
}

@QueryHandler(GetTransactionsByAccountQuery)
export default class GetTransactionsByAccountQueryHandler
	implements
		IQueryHandler<
			GetTransactionsByAccountQuery,
			PaginationResponseDTO<GetTransactionsByAccountOutputDTO>
		>
{
	constructor(
		@InjectRepository(AccountEntity)
		private readonly accountsRepository: Repository<AccountEntity>,
		@InjectRepository(TransactionEntity)
		private readonly transactionsRepository: Repository<TransactionEntity>,
	) {}

	async execute(
		query: GetTransactionsByAccountQuery,
	): Promise<PaginationResponseDTO<GetTransactionsByAccountOutputDTO>> {
		const { account, page, limit } = query

		// Calcula o offset (quantos itens pular)
		const skip = (page - 1) * limit

		const [invoices, totalItems] =
			await this.transactionsRepository.findAndCount({
				where: {
					account: {
						id: account.id,
					},
				},
				skip,
				take: limit,
				order: {
					createdAt: 'DESC',
				},
			})

		const transformedInvoices = plainToInstance(
			GetTransactionsByAccountOutputDTO,
			invoices,
			{
				excludeExtraneousValues: true,
			},
		)

		// Calcula os metadados da paginação
		const totalPages = Math.ceil(totalItems / limit)
		const count = invoices.length

		const meta: TPaginationMeta = {
			totalItems,
			count,
			itemsPerPage: limit,
			totalPages,
			currentPage: page,
		}

		// Cria e retorna a resposta paginada
		return new PaginationResponseDTO<GetTransactionsByAccountOutputDTO>(
			transformedInvoices,
			meta,
		)
	}
}
