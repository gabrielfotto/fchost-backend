import { MigrationInterface, QueryRunner } from "typeorm";

export class AccountBalanceDefault0Migration1745768499233 implements MigrationInterface {
    name = 'AccountBalanceDefault0Migration1745768499233'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "balance" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "balance" SET DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "machines" ALTER COLUMN "pricePerHour" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "machine-usages" ALTER COLUMN "cost" TYPE numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "machine-usages" ALTER COLUMN "cost" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "machines" ALTER COLUMN "pricePerHour" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "balance" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "balance" TYPE numeric`);
    }

}
