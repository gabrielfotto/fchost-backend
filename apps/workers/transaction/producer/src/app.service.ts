import { Injectable } from '@nestjs/common'

@Injectable()
export class TransactionProducerService {
	getHello(): string {
		return 'Hello World!'
	}
}
