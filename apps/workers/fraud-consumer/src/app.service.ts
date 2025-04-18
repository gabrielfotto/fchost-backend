import { Injectable } from '@nestjs/common'

@Injectable()
export class FraudConsumerService {
	getHello(): string {
		return 'Hello World!'
	}
}
