import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { ConfigModule, ConfigService } from '@nestjs/config'
import {
	FraudFrequentHighValueEspecification,
	FraudSuspiciousAccountEspecification,
	FraudUnusualPatternEspecification,
} from './specifications'

import { FraudDetectionConsumerHandlerService } from './fraud.service'
import { FraudDetectionConsumerHandler } from './fraud.consumer'

import { rabbitmqConfigFn } from '@libs/config'
import { AccountEntity, InvoiceEntity } from '@libs/db/entities'

import { FraudSpecificationAggregator } from './specifications'

@Module({
	imports: [],
	providers: [
		FraudDetectionConsumerHandlerService,
		FraudDetectionConsumerHandler,

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
