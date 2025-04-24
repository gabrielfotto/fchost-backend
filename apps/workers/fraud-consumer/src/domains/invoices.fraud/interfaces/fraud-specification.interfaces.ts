import { AccountEntity } from '@libs/db/entities'
import { TFraudSpecificationResult } from '../types'

export interface IFraudSpecification {
	isSatisfied(account: AccountEntity, amount: string): Promise<boolean>
	getFraudReason(
		account: AccountEntity,
		amount: string,
	): TFraudSpecificationResult
}
