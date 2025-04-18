import { Module } from '@nestjs/common'
import { PublisherBillingController } from './app.controller'
import { PublisherBillingService } from './app.service'

@Module({
	imports: [],
	controllers: [PublisherBillingController],
	providers: [PublisherBillingService],
})
export class PublisherBillingModule {}
