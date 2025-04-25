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
export class MachineUsageEntity {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => AccountMachineEntity)
	accountMachine: AccountMachineEntity

	@Column({ type: 'timestamp' })
	startedAt: Date

	@Column({ type: 'timestamp', nullable: true })
	endedAt: Date

	@Column({ type: 'decimal', scale: 4, nullable: true })
	cost: string

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}
