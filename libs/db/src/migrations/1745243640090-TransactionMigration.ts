import { MigrationInterface, QueryRunner } from 'typeorm'

export class TransactionMigration1745243640090 implements MigrationInterface {
	name = 'TransactionMigration1745243640090'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TYPE "public"."frauds_reason_enum" AS ENUM('0', '1', '2')`,
		)
		await queryRunner.query(
			`CREATE TYPE "public"."transactions_type_enum" AS ENUM('credit', 'debit')`,
		)
		await queryRunner.query(
			`CREATE TABLE "transactions" ("id" SERIAL NOT NULL, "type" "public"."transactions_type_enum" NOT NULL, "value" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "accountId" integer, "invoiceId" integer, CONSTRAINT "REL_9bde8424ba459604061c4cb01f" UNIQUE ("invoiceId"), CONSTRAINT "PK_a219afd8dd77ed80f5a862f1db9" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(`ALTER TABLE "accounts" ADD "isSuspicious" boolean`)
		await queryRunner.query(
			`ALTER TABLE "invoices" ADD "isFraudProcessed" boolean NOT NULL DEFAULT false`,
		)
		await queryRunner.query(`ALTER TABLE "invoices" ADD "fraudId" integer`)
		await queryRunner.query(
			`ALTER TABLE "invoices" ADD CONSTRAINT "UQ_e32b419321e135156b16d7d6ebc" UNIQUE ("fraudId")`,
		)
		await queryRunner.query(
			`ALTER TYPE "public"."invoices_status_enum" RENAME TO "invoices_status_enum_old"`,
		)
		await queryRunner.query(
			`CREATE TYPE "public"."invoices_status_enum" AS ENUM('pending', 'approved', 'rejected', 'processed')`,
		)
		await queryRunner.query(
			`ALTER TABLE "invoices" ALTER COLUMN "status" DROP DEFAULT`,
		)
		await queryRunner.query(
			`ALTER TABLE "invoices" ALTER COLUMN "status" TYPE "public"."invoices_status_enum" USING "status"::"text"::"public"."invoices_status_enum"`,
		)
		await queryRunner.query(
			`ALTER TABLE "invoices" ALTER COLUMN "status" SET DEFAULT 'pending'`,
		)
		await queryRunner.query(`DROP TYPE "public"."invoices_status_enum_old"`)
		await queryRunner.query(
			`ALTER TABLE "frauds" ADD CONSTRAINT "FK_180f86b0432b5587664ac84f62c" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "invoices" ADD CONSTRAINT "FK_e32b419321e135156b16d7d6ebc" FOREIGN KEY ("fraudId") REFERENCES "frauds"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "transactions" ADD CONSTRAINT "FK_26d8aec71ae9efbe468043cd2b9" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "transactions" ADD CONSTRAINT "FK_9bde8424ba459604061c4cb01f2" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "transactions" DROP CONSTRAINT "FK_9bde8424ba459604061c4cb01f2"`,
		)
		await queryRunner.query(
			`ALTER TABLE "transactions" DROP CONSTRAINT "FK_26d8aec71ae9efbe468043cd2b9"`,
		)
		await queryRunner.query(
			`ALTER TABLE "invoices" DROP CONSTRAINT "FK_e32b419321e135156b16d7d6ebc"`,
		)
		await queryRunner.query(
			`CREATE TYPE "public"."invoices_status_enum_old" AS ENUM('pending', 'approved', 'rejected')`,
		)
		await queryRunner.query(
			`ALTER TABLE "invoices" ALTER COLUMN "status" DROP DEFAULT`,
		)
		await queryRunner.query(
			`ALTER TABLE "invoices" ALTER COLUMN "status" TYPE "public"."invoices_status_enum_old" USING "status"::"text"::"public"."invoices_status_enum_old"`,
		)
		await queryRunner.query(
			`ALTER TABLE "invoices" ALTER COLUMN "status" SET DEFAULT 'pending'`,
		)
		await queryRunner.query(`DROP TYPE "public"."invoices_status_enum"`)
		await queryRunner.query(
			`ALTER TYPE "public"."invoices_status_enum_old" RENAME TO "invoices_status_enum"`,
		)
		await queryRunner.query(
			`ALTER TABLE "invoices" DROP CONSTRAINT "UQ_e32b419321e135156b16d7d6ebc"`,
		)
		await queryRunner.query(`ALTER TABLE "invoices" DROP COLUMN "fraudId"`)
		await queryRunner.query(
			`ALTER TABLE "invoices" DROP COLUMN "isFraudProcessed"`,
		)
		await queryRunner.query(`ALTER TABLE "accounts" DROP COLUMN "isSuspicious"`)
		await queryRunner.query(`DROP TABLE "transactions"`)
		await queryRunner.query(`DROP TYPE "public"."transactions_type_enum"`)
		await queryRunner.query(`DROP TYPE "public"."frauds_reason_enum"`)
	}
}
