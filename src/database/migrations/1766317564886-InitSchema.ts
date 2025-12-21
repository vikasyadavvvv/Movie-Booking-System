import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1766317564886 implements MigrationInterface {
    name = 'InitSchema1766317564886'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."show_seats_status_enum" AS ENUM('AVAILABLE', 'LOCKED', 'BOOKED')`);
        await queryRunner.query(`CREATE TABLE "show_seats" ("id" SERIAL NOT NULL, "status" "public"."show_seats_status_enum" NOT NULL DEFAULT 'AVAILABLE', "lockedUntil" TIMESTAMP, "show_id" integer, "seat_id" integer, "booking_id" integer, CONSTRAINT "UQ_5192dfcffc4b3fc85cf2023e90a" UNIQUE ("show_id", "seat_id"), CONSTRAINT "PK_813a513d1949ce45d3419ef871c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a9b95cf2a11a620bb56559be3a" ON "show_seats" ("show_id", "status") `);
        await queryRunner.query(`ALTER TABLE "bookings" DROP COLUMN "seatNumbers"`);
        await queryRunner.query(`ALTER TABLE "show_seats" ADD CONSTRAINT "FK_35e037aba2021dee201e247939e" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "show_seats" ADD CONSTRAINT "FK_f6c97e4aa38db29e09bf360bf88" FOREIGN KEY ("seat_id") REFERENCES "seats"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "show_seats" ADD CONSTRAINT "FK_abe01c4fbe5e7b57054d7ad41c8" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "show_seats" DROP CONSTRAINT "FK_abe01c4fbe5e7b57054d7ad41c8"`);
        await queryRunner.query(`ALTER TABLE "show_seats" DROP CONSTRAINT "FK_f6c97e4aa38db29e09bf360bf88"`);
        await queryRunner.query(`ALTER TABLE "show_seats" DROP CONSTRAINT "FK_35e037aba2021dee201e247939e"`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD "seatNumbers" text NOT NULL`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a9b95cf2a11a620bb56559be3a"`);
        await queryRunner.query(`DROP TABLE "show_seats"`);
        await queryRunner.query(`DROP TYPE "public"."show_seats_status_enum"`);
    }

}
