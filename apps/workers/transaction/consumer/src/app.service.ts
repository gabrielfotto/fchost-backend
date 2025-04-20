import { Injectable } from '@nestjs/common'

@Injectable()
export class TransactionConsumerService {
	getHello(): string {
		return 'Hello World!'
	}
}
