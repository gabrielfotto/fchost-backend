import { Injectable } from '@nestjs/common'
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'

import { FraudConsumerService } from './fraud.service'
import { InvoiceDTO } from './fraud.dtos'

@Injectable()
export class FraudConsumerQueues {
	constructor(private readonly fraudConsumerService: FraudConsumerService) {}

	// @RabbitSubscribe({
	// 	exchange: 'default',
	// 	routingKey: 'invoices.fraud.detect',
	// 	queue: 'invoices.fraud.detect',
	// 	queueOptions: {
	// 		// channel: 'channel',
	// 		durable: true,
	// 		arguments: {
	// 			'x-queue-type': 'quorum',
	// 			'x-delivery-limit': 1,
	// 		},
	// 	},
	// })
	// async fraudConsumerQueueHandler(payload: InvoiceDTO) {
	// 	await this.fraudConsumerService.execute(payload)
	// }
}
