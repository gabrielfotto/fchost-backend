import { Injectable } from '@nestjs/common'
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'

import { DebitAccountBalanceService } from './debit-balance.service'
// import { InvoiceDTO } from './fraud.dtos'

@Injectable()
export class DebitAccountBalanceConsumer {
	constructor(
		private readonly DebitAccountBalanceService: DebitAccountBalanceService,
	) {}

	@RabbitSubscribe({
		exchange: 'fcpay',
		routingKey: 'accounts.balance.debit',
		queue: 'accounts.balance.debit',
		queueOptions: {
			durable: true,
			arguments: {
				'x-queue-type': 'quorum',
				'x-delivery-limit': 1,
			},
		},
	})
	async handler(message) {
		await this.DebitAccountBalanceService.execute(message)
	}
}
