import { Controller, Get } from '@nestjs/common'
import { ConsumerBillingService } from './app.service'

@Controller()
export class ConsumerBillingController {
	constructor(
		private readonly consumerBillingService: ConsumerBillingService,
	) {}

	@Get()
	getHello(): string {
		return this.consumerBillingService.getHello()
	}
}
