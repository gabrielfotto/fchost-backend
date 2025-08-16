import {
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

import { AccountMachineEntity } from '.'

@Entity({ name: 'machine-usages' })
export default class MachineUsageEntity {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => AccountMachineEntity)
	accountMachine: AccountMachineEntity

	@Column({ type: 'timestamp' })
	startedAt: Date

	@Column({ type: 'timestamp', nullable: true })
	endedAt?: Date

	@Column({ type: 'decimal', scale: 4, default: 0 })
	cost: string

	// the last time when cron service (transaction-producer) executed/processed the cost to be debited for this machine usage
	@Column({ type: 'timestamp', nullable: true })
	lastProcessedAt?: Date | null

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}
