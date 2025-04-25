import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

import { InvoiceEntity } from '.'
import { EFraudReason } from '../enums'

@Entity({ name: 'invoice-frauds' })
export default class FraudEntity {
	@PrimaryGeneratedColumn()
	id: number

	@OneToOne(() => InvoiceEntity, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'invoiceId' })
	invoice: InvoiceEntity

	@Column({ type: 'enum', enum: EFraudReason })
	reason: EFraudReason

	@Column()
	description: string

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}
