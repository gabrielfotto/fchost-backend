import {
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

import { AccountEntity } from '.'

@Entity({ name: 'transactions' })
export default class TransactionEntity {
	@PrimaryGeneratedColumn()
	id: number

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}
