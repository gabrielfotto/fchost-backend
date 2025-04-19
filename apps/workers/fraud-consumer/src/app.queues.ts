import { Injectable } from '@nestjs/common'
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'

import { FraudConsumerService } from './app.service'
import { InvoiceDTO } from './app.dtos'

@Injectable()
export class FraudConsumerQueues {
	constructor(private readonly fraudConsumerService: FraudConsumerService) {}

	@RabbitSubscribe({
		exchange: 'default',
		routingKey: 'invoices.fraud',
		queue: 'invoices.fraud',
		queueOptions: {
			durable: true,
			arguments: {
				'x-queue-type': 'quorum',
				'x-delivery-limit': 1,
			},
		},
	})
	async fraudConsumerQueueHandler(payload: InvoiceDTO) {
		await this.fraudConsumerService.execute(payload)
	}
}
