import { AccountEntity } from '@libs/db/entities'
import { EFraudReason } from '@libs/common/enums'

export type TFraudSpecificationData = {
	account: AccountEntity
	amount: string
}

export type TFraudSpecificationResult = {
	reason: EFraudReason
	description: string
}
