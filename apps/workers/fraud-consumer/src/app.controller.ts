import { Controller, Get } from '@nestjs/common'
import { FraudConsumerService } from './app.service'

@Controller()
export class FraudConsumerController {
	constructor(private readonly fraudConsumerService: FraudConsumerService) {}

	@Get()
	getHello(): string {
		return this.fraudConsumerService.getHello()
	}
}
