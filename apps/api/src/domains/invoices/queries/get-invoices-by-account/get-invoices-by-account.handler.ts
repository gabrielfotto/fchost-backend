import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { plainToInstance } from 'class-transformer'

import { PaginationResponseDTO } from '@api/dtos/pagination.dtos'
import { TPaginationMeta } from '@api/types/pagination.types'
import { plainToInstanceAndValidate } from '@api/utils/plain-to-instance-and-validate.utils'

import { GetInvoicesByAccountOutputDTO } from './get-invoices-by-account.dtos'

import { AccountEntity, InvoiceEntity } from '@libs/db/entities'

export class GetInvoicesByAccountQuery {
	account: AccountEntity

	// pagination
	page: number
	limit: number
}

@QueryHandler(GetInvoicesByAccountQuery)
export default class GetInvoicesByAccountQueryHandler
	implements
		IQueryHandler<
			GetInvoicesByAccountQuery,
			PaginationResponseDTO<GetInvoicesByAccountOutputDTO>
		>
{
	constructor(
		@InjectRepository(AccountEntity)
		private readonly accountsRepository: Repository<AccountEntity>,
		@InjectRepository(InvoiceEntity)
		private readonly invoicesRepository: Repository<InvoiceEntity>,
	) {}

	async execute(
		query: GetInvoicesByAccountQuery,
	): Promise<PaginationResponseDTO<GetInvoicesByAccountOutputDTO>> {
		const { account, page, limit } = query

		// Calcula o offset (quantos itens pular)
		const skip = (page - 1) * limit

		const [invoices, totalItems] = await this.invoicesRepository.findAndCount({
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

		// ---> Transforma cada InvoiceEntity em GetInvoicesByAccountOutputDTO <---
		// plainToInstance itera sobre o array 'invoices'
		// const transformedInvoices = await plainToInstanceAndValidate(
		// 	GetInvoicesByAccountOutputDTO,
		// 	invoices,
		// )

		const transformedInvoices = plainToInstance(
			GetInvoicesByAccountOutputDTO,
			invoices,
			{
				// Importante: Garante que apenas propriedades com @Expose() sejam incluídas
				// e que transformações padrão sejam aplicadas.
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
		return new PaginationResponseDTO<GetInvoicesByAccountOutputDTO>(
			transformedInvoices,
			meta,
		)
	}
}
