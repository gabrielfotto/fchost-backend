import { Module } from '@nestjs/common'

import { BillingProducerController } from './app.controller'
import { BillingProducerService } from './app.service'

@Module({
	imports: [],
	controllers: [BillingProducerController],
	providers: [BillingProducerService],
})
export class BillingProducerModule {}
