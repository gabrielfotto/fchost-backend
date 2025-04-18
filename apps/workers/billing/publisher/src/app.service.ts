import { Injectable } from '@nestjs/common'

@Injectable()
export class BillingPublisherService {
	getHello(): string {
		return 'Hello World!'
	}
}
