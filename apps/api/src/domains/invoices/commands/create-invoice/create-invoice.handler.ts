import { Logger, NotFoundException } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'
import { InjectDataSource } from '@nestjs/typeorm'
import { DataSource } from 'typeorm'

import { AccountEntity, InvoiceEntity } from '@libs/db/entities'

import { CreateInvoiceOutputDTO } from './create-invoice.dtos'
import { TCreditCard } from '../../types'
import { CreditCardHelper } from '../../helpers'

export class CreateInvoiceCommand {
	account: AccountEntity
	amount: string
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
		const { cardLast4Digits } = new CreditCardHelper(card)

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
					cardLast4Digits,
				})

				await manager.save(InvoiceEntity, invoice)
				return invoice
			},
		)

		if (invoice) {
			const message = { invoice_id: invoice.id }
			await this.amqpConnection.publish(
				'fcpay',
				'invoices.fraud.detection',
				message,
			)

			this.logger.debug(
				`Message sent to 'invoices.fraud.detection': ${JSON.stringify(message)}`,
			)
		}

		return invoice
	}
}
