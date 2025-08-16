import { Injectable, Logger } from '@nestjs/common'
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'

import { DebitAccountBalanceQueueService } from './debit-balance.service'
import { DebitBalanceQueueInputDTO } from './debit-balance.dtos'

@Injectable()
export class DebitAccountBalanceQueueConsumerHandler {
	private readonly logger: Logger = new Logger(
		DebitAccountBalanceQueueConsumerHandler.name,
		{
			timestamp: true,
		},
	)

	constructor(
		private readonly debitAccountBalanceQueueService: DebitAccountBalanceQueueService,
	) {}

	@RabbitSubscribe({
		exchange: 'fchost',
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
	async handler(message: DebitBalanceQueueInputDTO) {
		await this.debitAccountBalanceQueueService.execute(message)
		this.logger.debug(`Message consumed: ${JSON.stringify(message)}`)
	}
}
