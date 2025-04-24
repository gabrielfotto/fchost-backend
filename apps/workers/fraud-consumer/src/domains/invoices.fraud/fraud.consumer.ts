import { Injectable, Logger } from '@nestjs/common'
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'

import { FraudDetectionConsumerHandlerService } from './fraud.service'
import { FraudDetectionInputDTO } from './fraud.dtos'

@Injectable()
export class FraudDetectionConsumerHandler {
	private readonly logger: Logger = new Logger(
		FraudDetectionConsumerHandler.name,
		{
			timestamp: true,
		},
	)

	constructor(
		private readonly fraudDetectionConsumerHandlerService: FraudDetectionConsumerHandlerService,
	) {}

	@RabbitSubscribe({
		exchange: 'fcpay',
		routingKey: 'invoices.fraud.detection',
		queue: 'invoices.fraud.detection',
		queueOptions: {
			durable: true,
			arguments: {
				'x-queue-type': 'quorum',
				'x-delivery-limit': 1,
			},
		},
	})
	async handler(message: FraudDetectionInputDTO) {
		await this.fraudDetectionConsumerHandlerService.execute(message)
		this.logger.debug(`Message consumed: ${JSON.stringify(message)}`)
	}
}
