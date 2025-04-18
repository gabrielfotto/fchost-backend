import { Controller, Get } from '@nestjs/common'
import { BillingPublisherService } from './app.service'

@Controller()
export class BillingPublisherController {
	constructor(
		private readonly billingPublisherService: BillingPublisherService,
	) {}

	@Get()
	getHello(): string {
		return this.billingPublisherService.getHello()
	}
}
