import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'

import { ICron } from './app.interfaces'
import { AppService } from './app.service'

@Injectable()
export class AppCron implements ICron {
	constructor(private readonly appService: AppService) {}

	@Cron(CronExpression.EVERY_5_MINUTES)
	async run() {
		await this.appService.execute()
	}
}
