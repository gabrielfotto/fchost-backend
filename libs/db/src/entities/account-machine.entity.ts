import {
	Column,
	CreateDateColumn,
	Entity,
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
	account: AccountEntity

	@ManyToOne(() => MachineEntity)
	machine: MachineEntity

	@Column({ type: 'enum', enum: EMachineStatus })
	status: EMachineStatus

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}
