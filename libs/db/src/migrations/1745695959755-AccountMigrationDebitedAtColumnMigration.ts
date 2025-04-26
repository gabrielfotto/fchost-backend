import { MigrationInterface, QueryRunner } from "typeorm";

export class AccountMigrationDebitedAtColumnMigration1745695959755 implements MigrationInterface {
    name = 'AccountMigrationDebitedAtColumnMigration1745695959755'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "machine-usages" RENAME COLUMN "processedAt" TO "debitedAt"`);
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "balance" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "machines" ALTER COLUMN "pricePerHour" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "machine-usages" ALTER COLUMN "cost" TYPE numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "machine-usages" ALTER COLUMN "cost" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "machines" ALTER COLUMN "pricePerHour" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "balance" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "machine-usages" RENAME COLUMN "debitedAt" TO "processedAt"`);
    }

}
