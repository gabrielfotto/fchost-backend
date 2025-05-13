import { Injectable, Logger } from '@nestjs/common'
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq'

import { CreditAccountBalanceService } from './credit-balance.service'
import { CreditBalanceInputDTO } from './credit-balance.dtos'

@Injectable()
export class CreditAccountBalanceConsumerHandler {
	private readonly logger: Logger = new Logger(
		CreditAccountBalanceConsumerHandler.name,
		{
			timestamp: true,
		},
	)

	constructor(
		private readonly creditAccountBalanceService: CreditAccountBalanceService,
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
	async handler(message: CreditBalanceInputDTO) {
		await this.creditAccountBalanceService.execute(message)
		this.logger.debug(`Message consumed: ${JSON.stringify(message)}`)
	}
}
