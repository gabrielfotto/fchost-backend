import { MigrationInterface, QueryRunner } from 'typeorm'

export class MachinesMigration1745539773804 implements MigrationInterface {
	name = 'MachinesMigration1745539773804'

	public async up(queryRunner: QueryRunner): Promise<void> {
		// await queryRunner.query(
		// 	`CREATE TYPE "public"."invoice-frauds_reason_enum" AS ENUM('0', '1', '2')`,
		// )
		await queryRunner.query(
			`CREATE TABLE "invoice-frauds" ("id" SERIAL NOT NULL, "reason" "public"."invoice-frauds_reason_enum" NOT NULL, "description" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "invoiceId" integer, CONSTRAINT "REL_172322d7190fb8c6a1b2f7c9fa" UNIQUE ("invoiceId"), CONSTRAINT "PK_6e456175aba22dfe45e8c9a5057" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE TABLE "machines" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "vcpu" integer NOT NULL, "ram" integer NOT NULL, "pricePerHour" numeric NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_7b0817c674bb984650c5274e713" PRIMARY KEY ("id"))`,
		)
		// await queryRunner.query(
		// 	`CREATE TYPE "public"."account-machines_status_enum" AS ENUM('on', 'off')`,
		// )
		await queryRunner.query(
			`CREATE TABLE "account-machines" ("id" SERIAL NOT NULL, "status" "public"."account-machines_status_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "accountId" integer, "machineId" integer, CONSTRAINT "PK_6fe90badf55733a4652c19ca2da" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`ALTER TABLE "accounts" ALTER COLUMN "balance" TYPE numeric`,
		)
		await queryRunner.query(
			`ALTER TABLE "invoice-frauds" ADD CONSTRAINT "FK_172322d7190fb8c6a1b2f7c9fa8" FOREIGN KEY ("invoiceId") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "account-machines" ADD CONSTRAINT "FK_790bf80ce9de206b0d5772ca68f" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
		await queryRunner.query(
			`ALTER TABLE "account-machines" ADD CONSTRAINT "FK_cb077701d5b00e8b973874a7633" FOREIGN KEY ("machineId") REFERENCES "machines"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "account-machines" DROP CONSTRAINT "FK_cb077701d5b00e8b973874a7633"`,
		)
		await queryRunner.query(
			`ALTER TABLE "account-machines" DROP CONSTRAINT "FK_790bf80ce9de206b0d5772ca68f"`,
		)
		await queryRunner.query(
			`ALTER TABLE "invoice-frauds" DROP CONSTRAINT "FK_172322d7190fb8c6a1b2f7c9fa8"`,
		)
		await queryRunner.query(
			`ALTER TABLE "accounts" ALTER COLUMN "balance" TYPE numeric`,
		)
		await queryRunner.query(`DROP TABLE "account-machines"`)
		await queryRunner.query(`DROP TYPE "public"."account-machines_status_enum"`)
		await queryRunner.query(`DROP TABLE "machines"`)
		await queryRunner.query(`DROP TABLE "invoice-frauds"`)
		await queryRunner.query(`DROP TYPE "public"."invoice-frauds_reason_enum"`)
	}
}
