import { Injectable, Logger } from '@nestjs/common'
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'

import { DebitAccountBalanceService } from '../debit-balance/debit-balance.service'
import { DebitBalanceInputDTO } from './debit-balance.dtos'

@Injectable()
export class DebitAccountBalanceConsumerHandler {
	private readonly logger: Logger = new Logger(
		DebitAccountBalanceConsumerHandler.name,
		{
			timestamp: true,
		},
	)

	constructor(
		private readonly debitAccountBalanceService: DebitAccountBalanceService,
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
	async handler(message: DebitBalanceInputDTO) {
		await this.debitAccountBalanceService.execute(message)
		this.logger.debug(`Message consumed: ${JSON.stringify(message)}`)
	}
}
