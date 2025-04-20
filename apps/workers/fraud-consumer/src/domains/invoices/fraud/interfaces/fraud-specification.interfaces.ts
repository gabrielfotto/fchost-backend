import { AccountEntity } from '@libs/db/entities'
import { EFraudReason } from '@libs/shared/enums'

export interface IFraudSpecificationResult {
	reason: EFraudReason
	description: string
}

export interface IFraudEspecification {
	isSatisfied(account: AccountEntity, amount: number): Promise<boolean>
	getFraudReason(
		account: AccountEntity,
		amount: number,
	): IFraudSpecificationResult
}

export interface IFraudEspecificationAggregator {
	execute(
		account: AccountEntity,
		amount: number,
	): Promise<IFraudSpecificationResult | null>
}
