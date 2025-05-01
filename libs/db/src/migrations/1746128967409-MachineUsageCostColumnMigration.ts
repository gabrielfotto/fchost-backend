import { MigrationInterface, QueryRunner } from "typeorm";

export class MachineUsageCostColumnMigration1746128967409 implements MigrationInterface {
    name = 'MachineUsageCostColumnMigration1746128967409'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "balance" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "value" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "machines" ALTER COLUMN "pricePerHour" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "machine-usages" ALTER COLUMN "cost" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "machine-usages" ALTER COLUMN "cost" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "machine-usages" ALTER COLUMN "cost" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "machine-usages" ALTER COLUMN "cost" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "machine-usages" ALTER COLUMN "cost" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "machine-usages" ALTER COLUMN "cost" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "machines" ALTER COLUMN "pricePerHour" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "transactions" ALTER COLUMN "value" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "balance" TYPE numeric`);
    }

}
