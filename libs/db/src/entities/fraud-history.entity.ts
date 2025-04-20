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

import { InvoiceEntity } from '.'
import { EFraudReason } from '../enums'

@Entity({ name: 'fraud-history' })
export default class FraudHistoryEntity {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => InvoiceEntity, { onDelete: 'CASCADE' })
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
