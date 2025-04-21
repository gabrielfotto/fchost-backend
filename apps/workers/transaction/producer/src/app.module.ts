import { Module } from '@nestjs/common'

import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { AppCron } from './app.cron'
import { AppService } from './app.service'

import { dataSourceOptionsFn } from '@libs/db/data-source'

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) =>
				dataSourceOptionsFn(configService),
		}),
	],
	controllers: [],
	providers: [AppCron, AppService],
})
export class AppModule {}
