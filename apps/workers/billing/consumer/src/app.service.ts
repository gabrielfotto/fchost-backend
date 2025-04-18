import { Injectable } from '@nestjs/common'

@Injectable()
export class ConsumerBillingService {
	getHello(): string {
		return 'Hello World!'
	}
}
