import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { AppCron } from './app.cron'
import { AppService } from './app.service'

import { GlobalModule } from './global.module'

@Module({
	imports: [ScheduleModule.forRoot(), GlobalModule],
	controllers: [],
	providers: [AppCron, AppService],
})
export class AppModule {}
