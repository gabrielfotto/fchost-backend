import { Controller, Get } from '@nestjs/common'
import { TransactionConsumerService } from './app.service'

@Controller()
export class TransactionConsumerController {
	constructor(
		private readonly TransactionConsumerService: TransactionConsumerService,
	) {}

	@Get()
	getHello(): string {
		return this.TransactionConsumerService.getHello()
	}
}
