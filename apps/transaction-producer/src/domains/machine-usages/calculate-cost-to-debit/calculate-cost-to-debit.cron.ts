import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { ICron } from '../../../app.interfaces'
import { CalculateMachineUsageCostToDebitService } from './calculate-cost-to-debit.service'

@Injectable()
export class CalculateMachineUsageCostToDebitCron implements ICron {
	private readonly logger: Logger = new Logger(
		CalculateMachineUsageCostToDebitCron.name,
		{
			timestamp: true,
		},
	)

	constructor(
		private readonly calculateMachineUsageCostToDebitService: CalculateMachineUsageCostToDebitService,
	) {}

	@Cron(CronExpression.EVERY_MINUTE, {
		waitForCompletion: true,
	})
	async run() {
		try {
			await this.calculateMachineUsageCostToDebitService.execute()
			this.logger.debug('Cron executed')
		} catch (error) {
			// console.error(error)
			this.logger.error(`Cron execution error: `, JSON.stringify(error))
		}
	}
}
