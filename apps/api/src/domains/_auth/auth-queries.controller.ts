import {
	Controller,
	DefaultValuePipe,
	Get,
	Param,
	ParseIntPipe,
	Query,
	UseGuards,
} from '@nestjs/common'
import { QueryBus } from '@nestjs/cqrs'
import { plainToInstance } from 'class-transformer'

import { Public } from '@api/decorators'
import { GoogleOAuth2Guard } from '@api/guards/google-oauth2.guard'

@Controller('auth')
export default class AuthQueriesController {
	constructor(private readonly queryBus: QueryBus) {}

	@Public()
	@UseGuards(GoogleOAuth2Guard)
	@Get('google/login')
	async googleOAuth2Login() {}
}
