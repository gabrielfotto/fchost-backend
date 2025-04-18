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

@Injectable()
export default class AuthGuard implements CanActivate {
	constructor(
		@InjectRepository(AccountEntity)
		private accountsRepository: Repository<AccountEntity>,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
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
