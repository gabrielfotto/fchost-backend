import { TFraud } from '@libs/common/types'

export class FraudDetectionInputDTO {
	invoice_id: number
}

export class FraudDetectionOutputDTO {
	id: number
	fraud?: TFraud
}
