import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1766318668890 implements MigrationInterface {
    name = 'InitSchema1766318668890'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "show_seats" DROP CONSTRAINT "FK_abe01c4fbe5e7b57054d7ad41c8"`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "expiresAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "confirmedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "cancelledAt" TIMESTAMP`);
        await queryRunner.query(`CREATE INDEX "IDX_4520a68d3487b1defb13c4211e" ON "show_seats" ("booking_id", "status") `);
        await queryRunner.query(`ALTER TABLE "show_seats" ADD CONSTRAINT "FK_abe01c4fbe5e7b57054d7ad41c8" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "show_seats" DROP CONSTRAINT "FK_abe01c4fbe5e7b57054d7ad41c8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4520a68d3487b1defb13c4211e"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "cancelledAt"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "confirmedAt"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "expiresAt"`);
        await queryRunner.query(`ALTER TABLE "show_seats" ADD CONSTRAINT "FK_abe01c4fbe5e7b57054d7ad41c8" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
