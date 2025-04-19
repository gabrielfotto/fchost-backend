import { ForbiddenException } from '@nestjs/common'
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { plainToInstance } from 'class-transformer'

import { GetInvoiceByIdOutputDTO } from './get-invoice-by-id.dtos'

import { AccountEntity, InvoiceEntity } from '@libs/db/entities'

export class GetInvoiceByIdQuery {
	account: AccountEntity
	id: number
}

@QueryHandler(GetInvoiceByIdQuery)
export default class GetInvoiceByIdQueryHandler
	implements IQueryHandler<GetInvoiceByIdQuery, GetInvoiceByIdOutputDTO | null>
{
	constructor(
		@InjectRepository(InvoiceEntity)
		private readonly invoicesRepository: Repository<InvoiceEntity>,
	) {}

	async execute(
		query: GetInvoiceByIdQuery,
	): Promise<GetInvoiceByIdOutputDTO | null> {
		const invoice = await this.invoicesRepository.findOneBy({
			id: query.id,
		})

		if (!invoice) {
			return null
		}

		if (invoice.account.id !== query.account.id) {
			throw new ForbiddenException()
		}

		return plainToInstance(GetInvoiceByIdOutputDTO, invoice)
	}
}
