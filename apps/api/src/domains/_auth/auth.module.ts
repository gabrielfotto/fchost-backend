import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'
import { ConfigModule } from '@nestjs/config'

import googleOauth2Config from '@api/config/google-oauth2.config'

import AuthQueriesController from './auth-queries.controller'

import { GoogleOAuth2Strategy } from '@api/strategies/google-oauth2.strategy'

@Module({
	imports: [CqrsModule, ConfigModule.forFeature(googleOauth2Config)],
	providers: [GoogleOAuth2Strategy],
	controllers: [AuthQueriesController],
})
export default class AuthModule {}
