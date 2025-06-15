import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { GlobalModule } from './global.module'

import { CalculateMachineUsageCostToDebitCron } from './domains/machine-usages/calculate-cost-to-debit/calculate-cost-to-debit.cron'
import { CalculateMachineUsageCostToDebitService } from './domains/machine-usages/calculate-cost-to-debit/calculate-cost-to-debit.service'

import { CheckAccountBalanceCron } from './domains/accounts/check-account-balance/check-account-balance.cron'
import { CheckAccountBalanceService } from './domains/accounts/check-account-balance/check-account-balance.service'

@Module({
	imports: [ScheduleModule.forRoot(), GlobalModule],
	controllers: [],
	providers: [
		CalculateMachineUsageCostToDebitCron,
		CalculateMachineUsageCostToDebitService,

		CheckAccountBalanceCron,
		CheckAccountBalanceService,
	],
})
export class AppModule {}
