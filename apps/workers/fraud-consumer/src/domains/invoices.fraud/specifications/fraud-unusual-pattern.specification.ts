import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { IFraudSpecification } from '../interfaces'
import { AccountEntity, InvoiceEntity } from '@libs/db/entities'
import { EFraudReason } from '@libs/shared/enums'

@Injectable()
export default class FraudUnusualPatternEspecification
	implements IFraudSpecification
{
	constructor(
		private readonly configService: ConfigService,
		@InjectRepository(InvoiceEntity)
		private readonly invoicesRepository: Repository<InvoiceEntity>,
	) {}

	async isSatisfied(account: AccountEntity, amount: number): Promise<boolean> {
		const INVOICE_HISTORY_LIMIT = this.configService.get(
			'fraud.INVOICE_HISTORY_LIMIT',
		)

		const MAX_VARIATION_PERCENTAGE = this.configService.get(
			'fraud.MAX_VARIATION_PERCENTAGE',
		)

		const invoices = await this.invoicesRepository.find({
			where: { account: { id: account.id } },
			order: { createdAt: 'DESC' },
			take: INVOICE_HISTORY_LIMIT,
		})

		if (!invoices.length) {
			return false
		}

		const total = invoices.reduce((acc, inv) => acc + inv.amount, 0)
		const average = total / invoices.length
		return amount > average * ((1 + MAX_VARIATION_PERCENTAGE) / 100)
	}

	getFraudReason(account: AccountEntity, amount: number) {
		return {
			reason: EFraudReason.UNUSUAL_PATTERN,
			description: `Amount ${amount} is unusually high for account ${account.id}`,
		}
	}
}
