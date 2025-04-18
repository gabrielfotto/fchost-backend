import { Type } from 'class-transformer'
import { IsInt, IsOptional, Max, Min } from 'class-validator'

import { TPaginationMeta } from '../types/pagination.types'

export class PaginationParamsDTO {
	@IsOptional()
	@Type(() => Number) // Garante que o valor seja convertido para número
	@IsInt()
	@Min(1)
	page?: number = 1 // Valor padrão se não for fornecido

	@IsOptional()
	@Type(() => Number)
	@IsInt()
	@Min(1) // Pelo menos 1 item por página
	@Max(100) // Limite máximo para evitar sobrecarga (ajuste conforme necessário)
	limit?: number = 10 // Valor padrão
}

export class PaginationResponseDTO<T> {
	data: T[]
	meta: TPaginationMeta

	constructor(data: T[], meta: TPaginationMeta) {
		this.data = data
		this.meta = meta
	}
}
