import { Module } from '@nestjs/common'

import { TransactionProducerController } from './app.controller'
import { TransactionProducerService } from './app.service'

@Module({
	imports: [],
	controllers: [TransactionProducerController],
	providers: [TransactionProducerService],
})
export class TransactionProducerModule {}
