// import { Module } from '@nestjs/common'
// import { TypeOrmModule } from '@nestjs/typeorm'
// import { ConfigModule, ConfigService } from '@nestjs/config'

// import { dataSourceOptionsFn } from './data-source'
// import { AccountEntity, InvoiceEntity } from './entities'

// @Module({
// 	imports: [
// 		TypeOrmModule.forRootAsync({
// 			imports: [ConfigModule],
// 			inject: [ConfigService],
// 			useFactory: (configService: ConfigService) =>
// 				dataSourceOptionsFn(configService),
// 		}),

// 		TypeOrmModule.forFeature([
// 			AccountEntity,
// 			InvoiceEntity,
// 			//
// 		]),
// 	],
// 	exports: [TypeOrmModule],
// })
// export default class DbModule {}
