import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

import AccountEntity from './account.entity'
import MachineEntity from './machine.entity'

import { EMachineStatus } from '../enums/machine-status.enum'

@Entity({ name: 'account-machines' })
export default class AccountMachinesEntity {
	@PrimaryGeneratedColumn()
	id: number

	@ManyToOne(() => AccountEntity)
	@JoinColumn({ name: 'accountId' })
	account: AccountEntity

	@ManyToOne(() => MachineEntity)
	@JoinColumn({ name: 'machineId' })
	machine: MachineEntity

	@Column({ type: 'enum', enum: EMachineStatus, default: EMachineStatus.OFF })
	status: EMachineStatus

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}
