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

	async execute() {
		/**
		 * 1. pegar account-machines onde processedAt está null (pegar todas as machine de uma account)
		 * 2. somar o custo por hora de cada machine da account
		 * 3. enviar para serviço de debit
		 */
		// usar padrão de events??
		// await this.amqpConnection.publish('fcpay', 'accounts.balance.debit', {})
	}
}
