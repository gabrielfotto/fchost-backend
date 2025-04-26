import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ConfigModule, ConfigService } from '@nestjs/config'

import AuthGuard from './shared/guards/auth.guard'

import AccountsModule from './domains/accounts/accounts.module'
import InvoicesModule from './domains/invoices/invoices.module'
import MachinesModule from './domains/machines/machines.module'

import { dataSourceOptionsFn } from '@libs/db/data-source'
import { AccountEntity, InvoiceEntity, MachineEntity } from '@libs/db/entities'

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

		TypeOrmModule.forFeature([
			AccountEntity,
			InvoiceEntity,
			MachineEntity,
			//
		]),

		AccountsModule,
		InvoicesModule,
		MachinesModule,
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
