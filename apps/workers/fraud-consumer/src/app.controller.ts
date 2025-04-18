import { Controller, Get } from '@nestjs/common'
import { ConsumerFraudService } from './app.service'

@Controller()
export class ConsumerFraudController {
	constructor(private readonly consumerFraudService: ConsumerFraudService) {}

	@Get()
	getHello(): string {
		return this.consumerFraudService.getHello()
	}
}
