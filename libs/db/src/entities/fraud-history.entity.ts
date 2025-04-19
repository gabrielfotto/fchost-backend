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

	@OneToMany(() => FraudHistoryEntity, fraud => fraud.invoice, {
		cascade: true,
	})
	fraudHistory: FraudHistoryEntity[]

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}
