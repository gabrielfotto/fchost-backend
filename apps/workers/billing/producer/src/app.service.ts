import { Injectable } from '@nestjs/common'

@Injectable()
export class BillingProducerService {
	getHello(): string {
		return 'Hello World!'
	}
}
