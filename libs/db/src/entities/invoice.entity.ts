import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

import { EInvoiceStatus } from '../../../shared/src/enums'
import { AccountEntity } from '.'

@Entity({ name: 'invoices' })
export default class InvoiceEntity {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => AccountEntity, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'accountId' })
	account: AccountEntity

	@Column()
	amount: number

	@Column({
		type: 'enum',
		enum: EInvoiceStatus,
		default: EInvoiceStatus.PENDING,
	})
	status: EInvoiceStatus

	@Column()
	description: string

	@Column()
	paymentType: string

	@Column()
	cardLastDigits: string

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}
