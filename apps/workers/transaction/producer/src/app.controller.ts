import { Controller, Get } from '@nestjs/common'
import { TransactionProducerService } from './app.service'

@Controller()
export class TransactionProducerController {
	constructor(
		private readonly TransactionProducerService: TransactionProducerService,
	) {}

	@Get()
	getHello(): string {
		return this.TransactionProducerService.getHello()
	}
}
