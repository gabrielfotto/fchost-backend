import { Injectable, Logger } from '@nestjs/common'
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'

import { CreditAccountBalanceQueueService } from './credit-balance.service'
import { CreditBalanceQueueInputDTO } from './credit-balance.dtos'

@Injectable()
export class CreditAccountBalanceQueueConsumerHandler {
	private readonly logger: Logger = new Logger(
		CreditAccountBalanceQueueConsumerHandler.name,
		{
			timestamp: true,
		},
	)

	constructor(
		private readonly creditAccountBalanceQueueService: CreditAccountBalanceQueueService,
	) {}

	@RabbitSubscribe({
		exchange: 'fchost',
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
	async handler(message: CreditBalanceQueueInputDTO) {
		await this.creditAccountBalanceQueueService.execute(message)
		this.logger.debug(`Message consumed: ${JSON.stringify(message)}`)
	}
}
