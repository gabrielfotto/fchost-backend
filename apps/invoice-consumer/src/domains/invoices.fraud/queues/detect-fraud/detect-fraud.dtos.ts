import { TFraud } from '@libs/common/types'

export class FraudDetectionQueueInputDTO {
	invoice_id: number
}

export class FraudDetectionQueueOutputDTO {
	id: number
	fraud?: TFraud
}
