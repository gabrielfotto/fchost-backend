import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { GlobalModule } from './global.module'

import { CheckAccountBalanceCron } from './domains/accounts/crons/check-account-balance/check-account-balance.cron'
import { CheckAccountBalanceService } from './domains/accounts/crons/check-account-balance/check-account-balance.service'

@Module({
	imports: [ScheduleModule.forRoot(), GlobalModule],
	controllers: [],
	providers: [CheckAccountBalanceCron, CheckAccountBalanceService],
})
export class AppModule {}
