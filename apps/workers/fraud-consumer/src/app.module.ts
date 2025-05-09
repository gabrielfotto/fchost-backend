import { Module } from '@nestjs/common'

import { GlobalModule } from './global.module'

import FraudModule from './domains/invoices.fraud/fraud.module'

@Module({
	imports: [GlobalModule, FraudModule],
	controllers: [],
	providers: [],
})
export class AppModule {}
