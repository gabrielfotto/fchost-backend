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
		const MIN_INVOICE_COUNT = this.configService.get('fraud.MIN_INVOICE_COUNT')

		const Z_SCORE_THRESHOLD = this.configService.get('fraud.Z_SCORE_THRESHOLD')

		const INVOICE_HISTORY_LIMIT = this.configService.get(
			'fraud.INVOICE_HISTORY_LIMIT',
		)

		// const MAX_VARIATION_PERCENTAGE = this.configService.get(
		// 	'fraud.MAX_VARIATION_PERCENTAGE',
		// )

		const invoices = await this.invoicesRepository.find({
			where: { account: { id: account.id } },
			order: { createdAt: 'DESC' },
			take: INVOICE_HISTORY_LIMIT,
		})

		if (invoices.length < MIN_INVOICE_COUNT) {
			return false
		}

		const amounts = invoices.map(inv => inv.amount)
		const average = amounts.reduce((a, b) => a + b, 0) / amounts.length

		const variance =
			amounts.reduce((sum, a) => sum + Math.pow(a - average, 2), 0) /
			amounts.length
		const stdDev = Math.sqrt(variance)

		const zScore = (amount - average) / stdDev
		return zScore >= Z_SCORE_THRESHOLD
	}

	getFraudReason(account: AccountEntity, amount: number) {
		return {
			reason: EFraudReason.UNUSUAL_PATTERN,
			description: `Amount ${amount} is unusually high for account ${account.id}`,
		}
	}
}
