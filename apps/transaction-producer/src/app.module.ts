import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { GlobalModule } from './global.module'

import { CalculateMachineUsageCostToDebitCron } from './domains/machine-usages/crons/calculate-cost-to-debit/calculate-cost-to-debit.cron'
import { CalculateMachineUsageCostToDebitService } from './domains/machine-usages/crons/calculate-cost-to-debit/calculate-cost-to-debit.service'

@Module({
	imports: [ScheduleModule.forRoot(), GlobalModule],
	controllers: [],
	providers: [
		CalculateMachineUsageCostToDebitCron,
		CalculateMachineUsageCostToDebitService,
	],
})
export class AppModule {}
