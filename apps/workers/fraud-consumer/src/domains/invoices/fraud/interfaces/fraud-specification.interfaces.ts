import { AccountEntity } from '@libs/db/entities'
import { TFraudSpecificationResult } from '../types'

export interface IFraudSpecification {
	isSatisfied(account: AccountEntity, amount: number): Promise<boolean>
	getFraudReason(
		account: AccountEntity,
		amount: number,
	): TFraudSpecificationResult
}
