import { MigrationInterface, QueryRunner } from "typeorm";

export class InvoiceCardLast4DigitsColumnMigration1745533639881 implements MigrationInterface {
    name = 'InvoiceCardLast4DigitsColumnMigration1745533639881'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoices" RENAME COLUMN "cardLastDigits" TO "cardLast4Digits"`);
        await queryRunner.query(`ALTER TABLE "invoices" ALTER COLUMN "amount" TYPE numeric(10,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invoices" ALTER COLUMN "amount" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "invoices" RENAME COLUMN "cardLast4Digits" TO "cardLastDigits"`);
    }

}
