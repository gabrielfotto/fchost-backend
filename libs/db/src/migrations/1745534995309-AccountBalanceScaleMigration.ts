import { MigrationInterface, QueryRunner } from "typeorm";

export class AccountBalanceScaleMigration1745534995309 implements MigrationInterface {
    name = 'AccountBalanceScaleMigration1745534995309'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "balance" TYPE numeric`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "balance" TYPE numeric`);
    }

}
