import { Module } from '@nestjs/common'

import { BillingPublisherController } from './app.controller'
import { BillingPublisherService } from './app.service'

@Module({
	imports: [],
	controllers: [BillingPublisherController],
	providers: [BillingPublisherService],
})
export class BillingPublisherModule {}
