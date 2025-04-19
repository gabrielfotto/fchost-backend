import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { CqrsModule } from '@nestjs/cqrs'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ConfigModule, ConfigService } from '@nestjs/config'
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq'

import AuthGuard from './shared/guards/auth.guard'

import AccountsModule from './domains/accounts/accounts.module'
import InvoicesModule from './domains/invoices/invoices.module'

import { dataSourceOptionsFn } from '@libs/db/data-source'
import { AccountEntity, InvoiceEntity } from '@libs/db/entities'

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
			//
		]),

		RabbitMQModule.forRoot({
			exchanges: [
				{
					name: 'default',
					type: 'topic',
				},
			],
			uri: 'amqp://rabbitmq:rabbitmq@fcpay-rabbitmq:5672',
			// connectionInitOptions: {
			// 	wait: false,
			// },
		}),

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
