import { Module } from '@nestjs/common'
import { ConsumerFraudController } from './app.controller'
import { ConsumerFraudService } from './app.service'

@Module({
	imports: [],
	controllers: [ConsumerFraudController],
	providers: [ConsumerFraudService],
})
export class ConsumerFraudModule {}
