import { MigrationInterface, QueryRunner } from 'typeorm'

export class AccountBalanceDefault10Migration1747186445296
	implements MigrationInterface
{
	name = 'AccountBalanceDefault10Migration1747186445296'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "accounts" ALTER COLUMN "balance" TYPE numeric`,
		)
		await queryRunner.query(
			`ALTER TABLE "accounts" ALTER COLUMN "balance" SET DEFAULT '10'`,
		)
		await queryRunner.query(
			`ALTER TABLE "transactions" ALTER COLUMN "value" TYPE numeric`,
		)
		await queryRunner.query(
			`ALTER TABLE "machines" ALTER COLUMN "pricePerHour" TYPE numeric`,
		)
		await queryRunner.query(
			`ALTER TABLE "machine-usages" ALTER COLUMN "cost" TYPE numeric`,
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "machine-usages" ALTER COLUMN "cost" TYPE numeric`,
		)
		await queryRunner.query(
			`ALTER TABLE "machines" ALTER COLUMN "pricePerHour" TYPE numeric`,
		)
		await queryRunner.query(
			`ALTER TABLE "transactions" ALTER COLUMN "value" TYPE numeric`,
		)
		await queryRunner.query(
			`ALTER TABLE "accounts" ALTER COLUMN "balance" SET DEFAULT '0'`,
		)
		await queryRunner.query(
			`ALTER TABLE "accounts" ALTER COLUMN "balance" TYPE numeric`,
		)
		await queryRunner.query(`ALTER TABLE "machines" DROP COLUMN "storage"`)
	}
}
