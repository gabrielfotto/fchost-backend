import { MigrationInterface, QueryRunner } from "typeorm";

export class AccountMachineUniqueMigration1745691068497 implements MigrationInterface {
    name = 'AccountMachineUniqueMigration1745691068497'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "balance" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "machines" ALTER COLUMN "pricePerHour" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "machine-usages" ALTER COLUMN "cost" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "account-machines" ADD CONSTRAINT "UQ_fa1908edcc55ded71173522f4eb" UNIQUE ("accountId", "machineId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account-machines" DROP CONSTRAINT "UQ_fa1908edcc55ded71173522f4eb"`);
        await queryRunner.query(`ALTER TABLE "machine-usages" ALTER COLUMN "cost" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "machines" ALTER COLUMN "pricePerHour" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "balance" TYPE numeric`);
    }

}
