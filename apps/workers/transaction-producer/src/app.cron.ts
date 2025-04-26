import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { ICron } from './app.interfaces'
import { AppService } from './app.service'

@Injectable()
export class AppCron implements ICron {
	private readonly logger: Logger = new Logger(AppCron.name)
	constructor(private readonly appService: AppService) {}

	@Cron(CronExpression.EVERY_MINUTE, { waitForCompletion: true })
	async run() {
		try {
			await this.appService.execute()
		} catch (error) {
			this.logger.error(`Cron executor error: `, JSON.stringify(error))
		}
	}
}
