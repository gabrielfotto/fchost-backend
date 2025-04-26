import { MigrationInterface, QueryRunner } from "typeorm";

export class MachineUsageProcessedAtColumnMigration1745540979724 implements MigrationInterface {
    name = 'MachineUsageProcessedAtColumnMigration1745540979724'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "machine-usages" ("id" SERIAL NOT NULL, "startedAt" TIMESTAMP NOT NULL, "endedAt" TIMESTAMP, "cost" numeric, "processedAt" TIMESTAMP, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "accountMachineId" integer, CONSTRAINT "PK_bb7a3010d98fe10184f06c346e7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "balance" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "machines" ALTER COLUMN "pricePerHour" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "machine-usages" ADD CONSTRAINT "FK_d23e9e12423170bde675b43e409" FOREIGN KEY ("accountMachineId") REFERENCES "account-machines"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "machine-usages" DROP CONSTRAINT "FK_d23e9e12423170bde675b43e409"`);
        await queryRunner.query(`ALTER TABLE "machines" ALTER COLUMN "pricePerHour" TYPE numeric`);
        await queryRunner.query(`ALTER TABLE "accounts" ALTER COLUMN "balance" TYPE numeric`);
        await queryRunner.query(`DROP TABLE "machine-usages"`);
    }

}
