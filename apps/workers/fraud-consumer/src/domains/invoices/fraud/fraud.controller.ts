import { Controller } from '@nestjs/common'
import { EventPattern, Payload } from '@nestjs/microservices'

import { FraudConsumerService } from './fraud.service'

@Controller()
export class InvoiceFraudListener {
	constructor(private readonly fraudConsumerService: FraudConsumerService) {}

	@EventPattern('invoices.fraud-detect')
	async handleInvoiceFraudDetection(@Payload() data: any) {
		await this.fraudConsumerService.execute(data)
	}
}
