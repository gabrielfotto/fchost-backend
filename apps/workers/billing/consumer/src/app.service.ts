import { Injectable } from '@nestjs/common'

@Injectable()
export class BillingConsumerService {
	getHello(): string {
		return 'Hello World!'
	}
}
