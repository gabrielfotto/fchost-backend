import { MigrationInterface, QueryRunner } from "typeorm";

export class AccountMachineJoinColumnMigration1745794964075 implements MigrationInterface {
    name = 'AccountMachineJoinColumnMigration1745794964075'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "balance" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "invoices" ALTER COLUMN "amount" TYPE numeric(10,2)`);
        await queryRunner.query(`ALTER TABLE "machines" ALTER COLUMN "pricePerHour" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "machine-usages" ALTER COLUMN "cost" TYPE numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "machine-usages" ALTER COLUMN "cost" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "machines" ALTER COLUMN "pricePerHour" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "invoices" ALTER COLUMN "amount" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "balance" TYPE numeric`);
    }

}
