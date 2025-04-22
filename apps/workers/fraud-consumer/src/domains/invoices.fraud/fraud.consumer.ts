import { Injectable } from '@nestjs/common'
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'

import { FraudDetectionConsumerHandlerService } from './fraud.service'
import { InvoiceDTO } from './fraud.dtos'

@Injectable()
export class FraudDetectionConsumerHandler {
	constructor(
		private readonly FraudDetectionConsumerHandlerService: FraudDetectionConsumerHandlerService,
	) {}

	@RabbitSubscribe({
		exchange: 'fcpay',
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
	async handler(message: InvoiceDTO) {
		await this.FraudDetectionConsumerHandlerService.execute(message)
	}
}
