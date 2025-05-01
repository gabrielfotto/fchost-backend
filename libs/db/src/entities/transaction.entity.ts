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

import { AccountEntity, InvoiceEntity } from '.'
import { ETransactionType } from '../enums/transaction-type.enum'

@Entity({ name: 'transactions' })
export default class TransactionEntity {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => AccountEntity, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'accountId' })
	account: AccountEntity

	@Column({ type: 'enum', enum: ETransactionType })
	type: ETransactionType

	@Column({ type: 'decimal', scale: 4, default: 0 })
	value: string

	// @Column()
	// balance: string

	@OneToOne(() => InvoiceEntity, { onDelete: 'CASCADE', nullable: true })
	@JoinColumn({ name: 'invoiceId' })
	invoice?: InvoiceEntity

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}
