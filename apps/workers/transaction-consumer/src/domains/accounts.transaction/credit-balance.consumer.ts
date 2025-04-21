import { Injectable } from '@nestjs/common'
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'

import { CreditAccountBalanceService } from './credit-balance.service'
// import { InvoiceDTO } from './fraud.dtos'

@Injectable()
export class CreditAccountBalanceConsumer {
	constructor(
		private readonly creditAccountBalanceService: CreditAccountBalanceService,
	) {}

	@RabbitSubscribe({
		exchange: 'fcpay',
		routingKey: 'accounts.balance.credit',
		queue: 'accounts.balance.credit',
		queueOptions: {
			durable: true,
			arguments: {
				'x-queue-type': 'quorum',
				'x-delivery-limit': 1,
			},
		},
	})
	async handler(message) {
		await this.creditAccountBalanceService.execute(message)
	}
}
