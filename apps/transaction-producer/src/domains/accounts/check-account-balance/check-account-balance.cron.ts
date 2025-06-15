import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { ICron } from '../../../app.interfaces'
import { CheckAccountBalanceService } from './check-account-balance.service'

@Injectable()
export class CheckAccountBalanceCron implements ICron {
	private readonly logger: Logger = new Logger(CheckAccountBalanceCron.name, {
		timestamp: true,
	})

	constructor(
		private readonly checkAccountBalanceService: CheckAccountBalanceService,
	) {}

	@Cron(CronExpression.EVERY_MINUTE, {
		waitForCompletion: true,
	})
	async run() {
		try {
			await this.checkAccountBalanceService.execute()
			this.logger.debug('Cron executed')
		} catch (error) {
			// console.error(error)
			this.logger.error(`Cron execution error: `, JSON.stringify(error))
		}
	}
}
