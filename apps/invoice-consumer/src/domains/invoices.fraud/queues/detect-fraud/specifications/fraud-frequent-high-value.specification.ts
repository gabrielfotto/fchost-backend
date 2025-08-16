import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { MoreThan, Repository } from 'typeorm'
import { subHours } from 'date-fns'

import { AccountEntity, InvoiceEntity } from '@libs/db/entities'
import { EFraudReason } from '@libs/common/enums'

@Injectable()
export default class FraudFrequentHighValueEspecification {
	constructor(
		private readonly configService: ConfigService,
		@InjectRepository(InvoiceEntity)
		private readonly invoicesRepository: Repository<InvoiceEntity>,
	) {}

	async isSatisfied(): Promise<boolean> {
		const MIN_FLAGGED_INVOICES = this.configService.get(
			'fraud.MIN_FLAGGED_INVOICES',
		)

		const TIMEFRAME_HOURS_FOR_ANALYSIS = this.configService.get(
			'fraud.TIMEFRAME_HOURS_FOR_ANALYSIS',
		)

		const since = subHours(new Date(), TIMEFRAME_HOURS_FOR_ANALYSIS)

		const timeframeInvoicesCount = await this.invoicesRepository.count({
			where: { createdAt: MoreThan(since) },
		})

		return timeframeInvoicesCount >= MIN_FLAGGED_INVOICES
	}

	getFraudReason(account: AccountEntity) {
		const MIN_FLAGGED_INVOICES = this.configService.get(
			'fraud.MIN_FLAGGED_INVOICES',
		)

		const TIMEFRAME_HOURS_FOR_ANALYSIS = this.configService.get(
			'fraud.TIMEFRAME_HOURS_FOR_ANALYSIS',
		)

		return {
			reason: EFraudReason.FREQUENT_HIGH_VALUE,
			description: `Account ${account.id} has more than ${MIN_FLAGGED_INVOICES} invoices in the last ${TIMEFRAME_HOURS_FOR_ANALYSIS} hours`,
		}
	}
}
