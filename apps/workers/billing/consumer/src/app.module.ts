import { Module } from '@nestjs/common'
import { ConsumerBillingController } from './app.controller'
import { ConsumerBillingService } from './app.service'

@Module({
	imports: [],
	controllers: [ConsumerBillingController],
	providers: [ConsumerBillingService],
})
export class ConsumerBillingModule {}
