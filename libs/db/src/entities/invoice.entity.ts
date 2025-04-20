import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

import { EInvoiceStatus } from '../enums'
import { TFraudHistory } from '@libs/shared/types'

import { AccountEntity } from '.'
import FraudHistoryEntity from './fraud-history.entity'

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

	@Column({ type: 'boolean' })
	isProcessed: boolean

	@OneToMany(() => FraudHistoryEntity, fraud => fraud.invoice, {
		cascade: true,
	})
	fraudHistory: TFraudHistory

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}
