import { MigrationInterface, QueryRunner } from "typeorm";

export class AccountMachineStatusDefaultMigration1745695069107 implements MigrationInterface {
    name = 'AccountMachineStatusDefaultMigration1745695069107'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "balance" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "machines" ALTER COLUMN "pricePerHour" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "account-machines" ALTER COLUMN "status" SET DEFAULT 'off'`);
        await queryRunner.query(`ALTER TABLE "machine-usages" ALTER COLUMN "cost" TYPE numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "machine-usages" ALTER COLUMN "cost" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "account-machines" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "machines" ALTER COLUMN "pricePerHour" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "balance" TYPE numeric`);
    }

}
