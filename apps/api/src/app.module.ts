import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'

import AuthGuard from './shared/guards/auth.guard'

import { dataSourceOptionsFn } from '@libs/db/data-source'
import { AccountEntity, InvoiceEntity } from '@libs/db/entities'

import AccountsModule from './domains/accounts/accounts.module'
import InvoicesModule from './domains/invoices/invoices.module'

@Module({
	imports: [
		CqrsModule,
		ConfigModule.forRoot(),

		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) =>
				dataSourceOptionsFn(configService),
		}),
		TypeOrmModule.forFeature([AccountEntity, InvoiceEntity]),

		AccountsModule,
		InvoicesModule,
	],
	controllers: [],
	providers: [
		{
			provide: APP_GUARD,
			useClass: AuthGuard,
		},
	],
})
export class AppModule {}
