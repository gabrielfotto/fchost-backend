import { AccountEntity } from '@libs/db/entities'
import { EFraudReason } from '@libs/shared/enums'

export type TFraudSpecificationData = {
	account: AccountEntity
	amount: number
}

export type TFraudSpecificationResult = {
	reason: EFraudReason
	description: string
}
