import { MigrationInterface, QueryRunner } from 'typeorm'

export class Migration1745082131936 implements MigrationInterface {
	name = 'Migration1745082131936'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "accounts" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "apiKey" character varying NOT NULL, "balance" numeric NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ee66de6cdc53993296d1ceb8aa0" UNIQUE ("email"), CONSTRAINT "UQ_445c904dd6830f676836dc577f1" UNIQUE ("apiKey"), CONSTRAINT "PK_5a7a02c20412299d198e097a8fe" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TYPE "public"."invoices_status_enum" AS ENUM('pending', 'approved', 'rejected')`,
		)
		await queryRunner.query(
			`CREATE TABLE "invoices" ("id" SERIAL NOT NULL, "amount" integer NOT NULL, "status" "public"."invoices_status_enum" NOT NULL DEFAULT 'pending', "description" character varying NOT NULL, "paymentType" character varying NOT NULL, "cardLast4Digits" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "accountId" integer, CONSTRAINT "PK_668cef7c22a427fd822cc1be3ce" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TYPE "public"."fraud-history_reason_enum" AS ENUM('0', '1', '2')`,
		)
		await queryRunner.query(
			`CREATE TABLE "fraud-history" ("id" SERIAL NOT NULL, "reason" "public"."fraud-history_reason_enum" NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "invoiceId" integer, CONSTRAINT "PK_a8c118c9dedd46821f05e10cd03" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`ALTER TABLE "invoices" ADD CONSTRAINT "FK_517b74001b457b209d95e4352e6" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "fraud-history" ADD CONSTRAINT "FK_32c2d94f6dbfe77cff2579a24ff" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "fraud-history" DROP CONSTRAINT "FK_32c2d94f6dbfe77cff2579a24ff"`,
		)
		await queryRunner.query(
			`ALTER TABLE "invoices" DROP CONSTRAINT "FK_517b74001b457b209d95e4352e6"`,
		)
		await queryRunner.query(`DROP TABLE "fraud-history"`)
		await queryRunner.query(`DROP TYPE "public"."fraud-history_reason_enum"`)
		await queryRunner.query(`DROP TABLE "invoices"`)
		await queryRunner.query(`DROP TYPE "public"."invoices_status_enum"`)
		await queryRunner.query(`DROP TABLE "accounts"`)
	}
}
