import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { ICron } from './app.interfaces'
import { AppService } from './app.service'

@Injectable()
export class AppCron implements ICron {
	private readonly logger: Logger = new Logger(AppCron.name, {
		timestamp: true,
	})

	constructor(private readonly appService: AppService) {}

	@Cron(CronExpression.EVERY_MINUTE, { waitForCompletion: true })
	async run() {
		try {
			await this.appService.execute()
			this.logger.debug('Cron executed')
		} catch (error) {
			this.logger.error(`Cron execution error: `, JSON.stringify(error))
		}
	}
}
