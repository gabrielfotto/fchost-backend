import { MigrationInterface, QueryRunner } from "typeorm";

export class InvoiceMigration1744564862490 implements MigrationInterface {
    name = 'InvoiceMigration1744564862490'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."invoices_status_enum" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "invoices" ("id" SERIAL NOT NULL, "amount" integer NOT NULL, "status" "public"."invoices_status_enum" NOT NULL DEFAULT 'pending', "description" character varying NOT NULL, "paymentType" character varying NOT NULL, "cardLastDigits" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "accountId" integer, CONSTRAINT "PK_668cef7c22a427fd822cc1be3ce" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD CONSTRAINT "FK_517b74001b457b209d95e4352e6" FOREIGN KEY ("accountId") REFERENCES "accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoices" DROP CONSTRAINT "FK_517b74001b457b209d95e4352e6"`);
        await queryRunner.query(`DROP TABLE "invoices"`);
        await queryRunner.query(`DROP TYPE "public"."invoices_status_enum"`);
    }

}
