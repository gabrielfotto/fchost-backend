import { Module } from '@nestjs/common'
import {
	FraudFrequentHighValueEspecification,
	FraudSuspiciousAccountEspecification,
	FraudUnusualPatternEspecification,
} from './queues/detect-fraud/specifications'

import { FraudDetectionQueueConsumerHandlerService } from './queues/detect-fraud/detect-fraud.service'
import { FraudDetectionQueueConsumerHandler } from './queues/detect-fraud/detect-fraud.consumer'

import { FraudSpecificationAggregator } from './queues/detect-fraud/specifications'

@Module({
	imports: [],
	providers: [
		FraudDetectionQueueConsumerHandlerService,
		FraudDetectionQueueConsumerHandler,

		FraudSpecificationAggregator,
		FraudFrequentHighValueEspecification,
		FraudSuspiciousAccountEspecification,
		FraudUnusualPatternEspecification,
		{
			provide: 'FRAUD_SPECIFICATIONS',
			inject: [
				FraudFrequentHighValueEspecification,
				FraudSuspiciousAccountEspecification,
				FraudUnusualPatternEspecification,
			],
			useFactory: (
				frequentHighValue: FraudFrequentHighValueEspecification,
				suspiciousAccount: FraudSuspiciousAccountEspecification,
				unusualPattern: FraudUnusualPatternEspecification,
			) => [frequentHighValue, suspiciousAccount, unusualPattern],
		},
	],
	controllers: [],
})
export default class FraudModule {}
