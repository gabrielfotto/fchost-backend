import { Module } from '@nestjs/common'

import { AppCron } from './app.cron'
import { AppService } from './app.service'

@Module({
	imports: [],
	controllers: [],
	providers: [AppCron, AppService],
})
export class AppModule {}
