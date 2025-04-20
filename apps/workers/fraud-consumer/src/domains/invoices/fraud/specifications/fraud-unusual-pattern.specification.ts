import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

import { IFraudEspecification } from '../interfaces'
import { AccountEntity, InvoiceEntity } from '@libs/db/entities'
import { EFraudReason } from '@libs/shared/enums'

@Injectable()
export default class FraudUnusualPatternEspecification
	implements IFraudEspecification
{
	constructor(
		@InjectRepository(InvoiceEntity)
		private readonly invoicesRepository: Repository<InvoiceEntity>,
	) {}

	async isSatisfied(account: AccountEntity, amount: number): Promise<boolean> {
		const invoices = await this.invoicesRepository.find({
			where: { account: { id: account.id } },
			order: { createdAt: 'DESC' },
			take: 20,
		})

		if (!invoices.length) {
			return false
		}

		const total = invoices.reduce((acc, inv) => acc + inv.amount, 0)
		const average = total / invoices.length
		return amount > average * 1.5
	}

	getFraudReason(account: AccountEntity, amount: number) {
		return {
			reason: EFraudReason.UNUSUAL_PATTERN,
			description: `Amount ${amount} is unusually high for account ${account.id}`,
		}
	}
}
