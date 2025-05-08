import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'machines' })
export default class MachineEntity {
	@PrimaryGeneratedColumn()
	id: number

	@Column()
	name: string

	@Column({ type: 'int' })
	vcpu: number

	@Column({ type: 'int' })
	ram: number // GB

	@Column({ type: 'int' })
	storage: number // GB

	@Column({ type: 'decimal', scale: 4 })
	pricePerHour: number

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date
}
