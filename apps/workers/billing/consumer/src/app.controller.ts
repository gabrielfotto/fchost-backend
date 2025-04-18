import { Controller, Get } from '@nestjs/common'
import { BillingConsumerService } from './app.service'

@Controller()
export class ConsumerBillingController {
	constructor(
		private readonly billingConsumerService: BillingConsumerService,
	) {}

	@Get()
	getHello(): string {
		return this.billingConsumerService.getHello()
	}
}
