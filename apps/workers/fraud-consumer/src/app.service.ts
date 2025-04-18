import { Injectable } from '@nestjs/common'

@Injectable()
export class ConsumerFraudService {
	getHello(): string {
		return 'Hello World!'
	}
}
