import { Inject, Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ConfigType } from '@nestjs/config'
import { CommandBus } from '@nestjs/cqrs'
import { plainToInstance } from 'class-transformer'
import { Strategy, VerifyCallback } from 'passport-google-oauth20'

import googleOAuth2Config from '@api/config/google-oauth2.config'
import { ValidateAccountCommand } from '@api/domains/accounts/commands/validate-account/validate-account.handler'

@Injectable()
export class GoogleOAuth2Strategy extends PassportStrategy(Strategy) {
	constructor(
		@Inject(googleOAuth2Config.KEY)
		private readonly googleConfig: ConfigType<typeof googleOAuth2Config>,
		private readonly commandBus: CommandBus,
	) {
		super({
			clientID: googleConfig.clientId!,
			clientSecret: googleConfig.clientSecret!,
			callbackURL: googleConfig.callbackUrl!,
			scope: ['email', 'profile'],
		})
	}

	async validate(
		accessToken: string,
		refreshToken: string,
		profile: any,
		cb: VerifyCallback,
	) {
		const [email] = profile.emails
		const name = profile.name

		const user = {
			name,
			email,
		}

		const command = plainToInstance(ValidateAccountCommand, user)
		const account = await this.commandBus.execute(command)

		cb(null, account)
	}
}
