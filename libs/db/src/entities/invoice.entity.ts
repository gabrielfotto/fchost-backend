import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

import { EInvoiceStatus } from '../enums'

import { AccountEntity } from '.'
import FraudEntity from './fraud.entity'

@Entity({ name: 'invoices' })
export default class InvoiceEntity {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => AccountEntity, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'accountId' })
	account: AccountEntity

	@Column({ type: 'decimal', precision: 10, scale: 2 })
	amount: string // FIX CAST BUG

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
	cardLast4Digits: string

	@Column({ type: 'boolean', default: false })
	isFraudProcessed: boolean

	@OneToOne(() => FraudEntity, fraud => fraud.invoice)
	@JoinColumn({ name: 'fraudId' })
	fraud?: FraudEntity

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}
