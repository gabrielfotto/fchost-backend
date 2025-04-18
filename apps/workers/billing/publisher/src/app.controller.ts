import { Controller, Get } from '@nestjs/common'
import { PublisherBillingService } from './app.service'

@Controller()
export class PublisherBillingController {
	constructor(
		private readonly publisherBillingService: PublisherBillingService,
	) {}

	@Get()
	getHello(): string {
		return this.publisherBillingService.getHello()
	}
}
