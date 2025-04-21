import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'
import { ConfigModule, ConfigService } from '@nestjs/config'
import {
	FraudFrequentHighValueEspecification,
	FraudSuspiciousAccountEspecification,
	FraudUnusualPatternEspecification,
} from './specifications'

import { FraudConsumerService } from './fraud.service'
import { FraudConsumerQueues } from './fraud.consumer'

import { rabbitmqConfigFn } from '@libs/config'
import { AccountEntity, InvoiceEntity } from '@libs/db/entities'

import { FraudSpecificationAggregator } from './specifications'

@Module({
	imports: [
		TypeOrmModule.forFeature([
			AccountEntity,
			InvoiceEntity,
			//
		]),

		RabbitMQModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) =>
				rabbitmqConfigFn(configService),
		}),
	],
	providers: [
		FraudConsumerService,
		FraudConsumerQueues,

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
