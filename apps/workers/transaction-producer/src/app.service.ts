import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'

import { ICronService } from './app.interfaces'
import { AccountEntity } from '@libs/db/entities'

@Injectable()
export class AppService implements ICronService {
	constructor(
		@InjectRepository(AccountEntity)
		private readonly accountsRepository: Repository<AccountEntity>,
		private readonly amqpConnection: AmqpConnection,
	) {}

	async execute() {}
}
