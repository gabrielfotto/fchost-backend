import { randomBytes } from 'node:crypto'
import {
	BeforeInsert,
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'accounts' })
export default class AccountEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@Column({ unique: true })
	email: string

	@Column({ unique: true })
	apiKey: string

	@Column({ type: 'decimal' })
	balance: number

	@Column({ type: 'boolean' })
	isSuspicious: boolean

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

	@BeforeInsert()
	generateApiKey() {
		this.apiKey = randomBytes(16).toString('hex')
	}
}
