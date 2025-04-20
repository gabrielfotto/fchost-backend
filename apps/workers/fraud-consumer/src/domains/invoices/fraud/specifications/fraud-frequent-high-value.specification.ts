import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { MoreThan, Repository } from 'typeorm'
import { subDays } from 'date-fns'

import { AccountEntity, InvoiceEntity } from '@libs/db/entities'
import { EFraudReason } from '@libs/shared/enums'

@Injectable()
export default class FraudFrequentHighValueEspecification {
	constructor(
		@InjectRepository(InvoiceEntity)
		private readonly invoicesRepository: Repository<InvoiceEntity>,
	) {}

	async isSatisfied(): Promise<boolean> {
		const since = subDays(new Date(), 1)

		const recent = await this.invoicesRepository.count({
			where: { createdAt: MoreThan(since) },
		})

		return recent >= 100
	}

	getFraudReason(account: AccountEntity) {
		return {
			reason: EFraudReason.FREQUENT_HIGH_VALUE,
			description: `Account ${account.id} has more than 100 invoices in the last 24 hours`,
		}
	}
}
