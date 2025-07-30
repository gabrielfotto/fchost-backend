import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { plainToInstance } from 'class-transformer'

import { AccountEntity, AccountMachineEntity } from '@libs/db/entities'
import { TPaginationMeta } from '@api/_common/types/pagination.types'

import { PaginationResponseDTO } from '@api/_common/dtos/pagination.dtos'
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

		const skip = (page - 1) * limit

		const qb = this.accountMachinesRepository
			.createQueryBuilder('accountMachine')
			.leftJoin('accountMachine.machine', 'machine')
			.leftJoin(
				'machine-usages',
				'machineUsage',
				'machineUsage.accountMachineId = accountMachine.id',
			)
			.where('accountMachine.accountId = :accountId', { accountId: account.id })
			.groupBy('accountMachine.id')
			.addGroupBy('machine.id')
			.select([
				'accountMachine.id',
				'accountMachine.status',
				'accountMachine.createdAt',
				'machine.id',
				'machine.name',
				'machine.vcpu',
				'machine.ram',
				'machine.storage',
				'machine.pricePerHour',
				'COALESCE(SUM("machineUsage"."cost"), 0) AS "totalUsageCost"',
				`COALESCE(SUM(
      EXTRACT(EPOCH FROM (
        COALESCE("machineUsage"."endedAt", NOW()) - "machineUsage"."startedAt"
      )) / 3600
    ), 0) AS "totalUsageHours"`,
			])
			.orderBy('accountMachine.createdAt', 'DESC')
			.skip(skip)
			.take(limit)

		const [accountMachinesRaw, totalItems] = await Promise.all([
			qb.getRawAndEntities(),
			this.accountMachinesRepository.count({
				where: { account: { id: account.id } },
			}),
		])

		const accountMachines = accountMachinesRaw.entities.map((entity, index) => {
			const raw = accountMachinesRaw.raw[index]

			return {
				id: entity.id,
				status: entity.status,
				totalUsageCost: Number(raw.totalUsageCost || 0).toFixed(4),
				totalUsageHours: Number(raw.totalUsageHours || 0).toFixed(2),
				machine: {
					name: entity.machine.name,
					vcpu: entity.machine.vcpu,
					ram: entity.machine.ram,
					storage: entity.machine.storage,
					pricePerHour: entity.machine.pricePerHour,
				},
			}
		})

		const transformedAccountMachines = plainToInstance(
			GetAccountMachinesOutputDTO,
			accountMachines,
			{
				excludeExtraneousValues: true,
			},
		)

		const totalPages = Math.ceil(totalItems / limit)
		const count = accountMachines.length

		const meta: TPaginationMeta = {
			totalItems,
			count,
			itemsPerPage: limit,
			totalPages,
			currentPage: page,
		}

		return new PaginationResponseDTO<GetAccountMachinesOutputDTO>(
			transformedAccountMachines,
			meta,
		)
	}
}
