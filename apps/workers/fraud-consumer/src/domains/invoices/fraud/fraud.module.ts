import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
// import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import {
	FraudFrequentHighValueEspecification,
	FraudSuspiciousAccountEspecification,
	FraudUnusualPatternEspecification,
} from './specifications'

import { FraudConsumerService } from './fraud.service'
import { FraudConsumerQueues } from './fraud.queues'

import { FraudEspecificationAggregator } from './specifications'
import { AccountEntity, InvoiceEntity } from '@libs/db/entities'
import { InvoiceFraudListener } from './fraud.controller'

@Module({
	imports: [
		TypeOrmModule.forFeature([
			AccountEntity,
			InvoiceEntity,
			//
		]),
	],
	providers: [
		// AmqpConnection,
		FraudConsumerService,
		// FraudConsumerQueues,

		FraudEspecificationAggregator,
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
	controllers: [InvoiceFraudListener],
})
export default class FraudModule {}
