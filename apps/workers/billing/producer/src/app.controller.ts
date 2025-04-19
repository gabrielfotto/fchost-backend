import { Controller, Get } from '@nestjs/common'
import { BillingProducerService } from './app.service'

@Controller()
export class BillingProducerController {
	constructor(
		private readonly BillingProducerService: BillingProducerService,
	) {}

	@Get()
	getHello(): string {
		return this.BillingProducerService.getHello()
	}
}
