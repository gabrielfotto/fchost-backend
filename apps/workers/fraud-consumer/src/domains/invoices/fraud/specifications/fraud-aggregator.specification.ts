import { Inject, Injectable } from '@nestjs/common'
import {
	IFraudEspecificationAggregator,
	IFraudEspecification,
	IFraudSpecificationResult,
} from '../interfaces'

import { AccountEntity } from '@libs/db/entities'

@Injectable()
export default class FraudEspecificationAggregator
	implements IFraudEspecificationAggregator
{
	constructor(
		@Inject('FRAUD_SPECIFICATIONS')
		private readonly fraudSpecifications: IFraudEspecification[],
	) {}

	async execute(
		account: AccountEntity,
		amount: number,
	): Promise<IFraudSpecificationResult | null> {
		let fraud = null
		for (const spec of this.fraudSpecifications) {
			let isFraudSatisfied = await spec.isSatisfied(account, amount)
			if (isFraudSatisfied) {
				// @ts-ignore
				fraud = await spec.getFraudReason(account, amount)
				break
			}
		}

		return fraud
	}
}
