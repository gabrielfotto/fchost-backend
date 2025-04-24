import { MigrationInterface, QueryRunner } from "typeorm";

export class InvoiceAmountTypeAsDecimalMigration1745452828690 implements MigrationInterface {
    name = 'InvoiceAmountTypeAsDecimalMigration1745452828690'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoices" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD "amount" numeric NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoices" DROP COLUMN "amount"`);
        await queryRunner.query(`ALTER TABLE "invoices" ADD "amount" integer NOT NULL`);
    }

}
