import { Injectable } from '@nestjs/common'
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'

import { FraudConsumerService } from './fraud.service'
import { InvoiceDTO } from './fraud.dtos'

@Injectable()
export class FraudConsumerQueues {
	constructor(private readonly fraudConsumerService: FraudConsumerService) {}

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
	async fraudConsumerQueueHandler(message: InvoiceDTO) {
		await this.fraudConsumerService.execute(message)
	}
}
