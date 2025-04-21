import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { dataSourceOptionsFn } from '@libs/db/data-source'
import FraudModule from './domains/invoices.fraud/fraud.module'

import constantsConfig from './config/constants.config'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			load: [constantsConfig],
		}),

		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) =>
				dataSourceOptionsFn(configService),
		}),

		FraudModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
