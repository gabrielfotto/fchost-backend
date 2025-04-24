import { Logger, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

import { AccountEntity, InvoiceEntity } from '@libs/db/entities'

import { CreateInvoiceOutputDTO } from './create-invoice.dtos'
import { TCreditCard } from '../../types'
import { CreditCardHelper, InvoiceHelper } from '../../helpers'

export class CreateInvoiceCommand {
	account: AccountEntity
	amount: number
	description: string
	paymentType: string
	card: TCreditCard
}

@CommandHandler(CreateInvoiceCommand)
export default class CreateInvoiceCommandHandler
	implements ICommandHandler<CreateInvoiceCommand, CreateInvoiceOutputDTO>
{
	private readonly logger: Logger = new Logger(
		CreateInvoiceCommandHandler.name,
		{
			timestamp: true,
		},
	)

	constructor(
		@InjectDataSource()
		private readonly dataSource: DataSource,
		private readonly amqpConnection: AmqpConnection,
	) {}

	async execute(
		command: CreateInvoiceCommand,
	): Promise<CreateInvoiceOutputDTO> {
		const { account, card, amount, description, paymentType } = command
		const { cardLastDigits } = new CreditCardHelper(card)

		const invoice = await this.dataSource.transaction<CreateInvoiceOutputDTO>(
			async manager => {
				const lockedAccount = await manager.findOne(AccountEntity, {
					where: { id: account.id },
					lock: { mode: 'pessimistic_write' },
				})

				if (!lockedAccount) {
					throw new NotFoundException('Account not found')
				}

				const invoice = manager.create(InvoiceEntity, {
					account: lockedAccount,
					amount,
					description,
					paymentType,
					cardLastDigits,
				})

				await manager.save(InvoiceEntity, invoice)
				await this.amqpConnection.publish('fcpay', 'invoices.fraud.detection', {
					invoice_id: invoice.id,
				})

				this.logger.debug(
					`Message sent to 'invoices.fraud.detection': ${JSON.stringify(invoice)}`,
				)

				return invoice
			},
		)

		return invoice
	}
}
