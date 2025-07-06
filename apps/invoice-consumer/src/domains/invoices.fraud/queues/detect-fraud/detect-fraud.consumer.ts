import { Injectable, Logger } from '@nestjs/common'
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'

import { FraudDetectionQueueConsumerHandlerService } from './detect-fraud.service'
import { FraudDetectionQueueInputDTO } from './detect-fraud.dtos'

@Injectable()
export class FraudDetectionQueueConsumerHandler {
	private readonly logger: Logger = new Logger(
		FraudDetectionQueueConsumerHandler.name,
		{
			timestamp: true,
		},
	)

	constructor(
		private readonly fraudDetectionQueueConsumerHandlerService: FraudDetectionQueueConsumerHandlerService,
	) {}

	@RabbitSubscribe({
		exchange: 'fchost',
		routingKey: 'invoices.fraud.detect',
		queue: 'invoices.fraud.detect',
		queueOptions: {
			durable: true,
			arguments: {
				'x-queue-type': 'quorum',
				'x-delivery-limit': 1,
			},
		},
	})
	async handler(message: FraudDetectionQueueInputDTO) {
		await this.fraudDetectionQueueConsumerHandlerService.execute(message)
		this.logger.debug(`Message consumed: ${JSON.stringify(message)}`)
	}
}
