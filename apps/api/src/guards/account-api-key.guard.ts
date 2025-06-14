import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { AccountEntity } from '@libs/db/entities'
import { IRequest } from '../interfaces/request.interfaces'
import { Reflector } from '@nestjs/core'

@Injectable()
export default class AccountApiKeyGuard implements CanActivate {
	constructor(
		@InjectRepository(AccountEntity)
		private accountsRepository: Repository<AccountEntity>,
		private readonly reflector: Reflector,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.get<boolean>(
			'isPublic',
			context.getHandler(),
		)

		if (isPublic) {
			return true
		}

		const request = context.switchToHttp().getRequest<IRequest>()
		const xApiKey = request.headers['x-api-key']

		if (!xApiKey || typeof xApiKey !== 'string') {
			throw new UnauthorizedException()
		}

		const account = await this.accountsRepository.findOneBy({
			apiKey: xApiKey,
		})

		if (!account) {
			throw new UnauthorizedException()
		}

		request.account = account
		return true
	}
}
