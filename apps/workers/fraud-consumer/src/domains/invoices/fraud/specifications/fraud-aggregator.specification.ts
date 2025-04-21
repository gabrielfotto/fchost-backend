import { Inject, Injectable } from '@nestjs/common'
import { IFraudSpecification } from '../interfaces'

import { ISpecificationAggregator } from '@libs/shared/interfaces'
import { TFraudSpecificationData, TFraudSpecificationResult } from '../types'

@Injectable()
export default class FraudEspecificationAggregator
	implements
		ISpecificationAggregator<TFraudSpecificationData, TFraudSpecificationResult>
{
	constructor(
		@Inject('FRAUD_SPECIFICATIONS')
		private readonly fraudSpecifications: IFraudSpecification[],
	) {}

	async execute({
		account,
		amount,
	}: TFraudSpecificationData): Promise<TFraudSpecificationResult | null> {
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
