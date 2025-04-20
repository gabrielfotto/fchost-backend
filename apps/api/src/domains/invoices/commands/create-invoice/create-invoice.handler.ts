import { NotFoundException } from '@nestjs/common'
import { InjectDataSource } from '@nestjs/typeorm'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { DataSource } from 'typeorm'
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq'

import { AccountEntity, InvoiceEntity } from '@libs/db/entities'
import { EInvoiceStatus } from '@libs/shared/enums'

import { CreateInvoiceOutputDTO } from './create-invoice.dtos'
import { TCreditCard } from '../../types/credit-card.types'
import { CreditCardHelper } from '../../helpers/credit-card.helper'
import { InvoiceHelper } from '../../helpers/invoice.helper'

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
					where: {
						id: account.id,
					},
					lock: {
						mode: 'pessimistic_write',
					},
				})

				if (!lockedAccount) {
					throw new NotFoundException('Account not found')
				}

				const invoiceHelper = new InvoiceHelper({
					account: lockedAccount,
					amount,
					description,
					paymentType,
					cardLastDigits,
					status: EInvoiceStatus.PENDING,
				})

				invoiceHelper.process()

				if (invoiceHelper.data.status === EInvoiceStatus.APPROVED) {
					lockedAccount.balance += amount
					await manager.save(lockedAccount)
				}

				const invoice = manager.create(InvoiceEntity, invoiceHelper.data)
				await manager.save(InvoiceEntity, invoice)
				return invoice
			},
		)

		return invoice
	}
}
