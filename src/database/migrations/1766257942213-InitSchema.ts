import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1766257942213 implements MigrationInterface {
    name = 'InitSchema1766257942213'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('USER', 'ADMIN')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'USER', "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") `);
        await queryRunner.query(`CREATE TABLE "movies" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "durationMinutes" integer NOT NULL, "language" character varying NOT NULL, "genres" text NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_c5b2c134e871bfd1c2fe7cc3705" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5aa0bbd146c0082d3fc5a0ad5d" ON "movies" ("title") `);
        await queryRunner.query(`CREATE TABLE "seats" ("id" SERIAL NOT NULL, "seatNumber" character varying NOT NULL, "seatType" character varying NOT NULL, "screen_id" integer, CONSTRAINT "PK_3fbc74bb4638600c506dcb777a7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "theatres" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "city" character varying NOT NULL, "location" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a1451caeaf6c1085e17e01ffe4a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "screens" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "totalSeats" integer NOT NULL, "seatLayout" jsonb NOT NULL, "theatre_id" integer, CONSTRAINT "PK_15b65ed44367c5411efccdd7de1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."shows_status_enum" AS ENUM('UPCOMING', 'RUNNING', 'CLOSED')`);
        await queryRunner.query(`CREATE TABLE "shows" ("id" SERIAL NOT NULL, "startTime" TIMESTAMP NOT NULL, "endTime" TIMESTAMP NOT NULL, "status" "public"."shows_status_enum" NOT NULL DEFAULT 'UPCOMING', "movie_id" integer, "screen_id" integer, CONSTRAINT "PK_db2b12161dbc5081c4f50025669" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ec789a6fbf7fadb8b43b4b4f0f" ON "shows" ("startTime") `);
        await queryRunner.query(`CREATE TYPE "public"."bookings_status_enum" AS ENUM('PENDING', 'CONFIRMED', 'CANCELLED')`);
        await queryRunner.query(`CREATE TABLE "bookings" ("id" SERIAL NOT NULL, "seatNumbers" text NOT NULL, "status" "public"."bookings_status_enum" NOT NULL DEFAULT 'PENDING', "totalAmount" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "show_id" integer, CONSTRAINT "PK_bee6805982cc1e248e94ce94957" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_64cd97487c5c42806458ab5520" ON "bookings" ("user_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_a3cc9fd502f91b02c0ff8f0973" ON "bookings" ("show_id") `);
        await queryRunner.query(`CREATE TYPE "public"."payments_status_enum" AS ENUM('INITIATED', 'SUCCESS', 'FAILED', 'TIMEOUT')`);
        await queryRunner.query(`CREATE TABLE "payments" ("id" SERIAL NOT NULL, "idempotencyKey" character varying NOT NULL, "status" "public"."payments_status_enum" NOT NULL DEFAULT 'INITIATED', "amount" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "booking_id" integer, CONSTRAINT "UQ_743b9fb1d2a059f2f7860418e4e" UNIQUE ("idempotencyKey"), CONSTRAINT "PK_197ab7af18c93fbb0c9b28b4a59" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e86edf76dc2424f123b9023a2b" ON "payments" ("booking_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_743b9fb1d2a059f2f7860418e4" ON "payments" ("idempotencyKey") `);
        await queryRunner.query(`ALTER TABLE "seats" ADD CONSTRAINT "FK_1e41697b2e0b74c477ad51867ca" FOREIGN KEY ("screen_id") REFERENCES "screens"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "screens" ADD CONSTRAINT "FK_89c064d26eded5f62a7a7efc777" FOREIGN KEY ("theatre_id") REFERENCES "theatres"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shows" ADD CONSTRAINT "FK_3156edf47a4e87e70c962ec5e8c" FOREIGN KEY ("movie_id") REFERENCES "movies"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "shows" ADD CONSTRAINT "FK_f09f83f47a11e5979d9c209799e" FOREIGN KEY ("screen_id") REFERENCES "screens"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_64cd97487c5c42806458ab5520c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "bookings" ADD CONSTRAINT "FK_a3cc9fd502f91b02c0ff8f0973f" FOREIGN KEY ("show_id") REFERENCES "shows"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "payments" ADD CONSTRAINT "FK_e86edf76dc2424f123b9023a2b2" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP CONSTRAINT "FK_e86edf76dc2424f123b9023a2b2"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_a3cc9fd502f91b02c0ff8f0973f"`);
        await queryRunner.query(`ALTER TABLE "bookings" DROP CONSTRAINT "FK_64cd97487c5c42806458ab5520c"`);
        await queryRunner.query(`ALTER TABLE "shows" DROP CONSTRAINT "FK_f09f83f47a11e5979d9c209799e"`);
        await queryRunner.query(`ALTER TABLE "shows" DROP CONSTRAINT "FK_3156edf47a4e87e70c962ec5e8c"`);
        await queryRunner.query(`ALTER TABLE "screens" DROP CONSTRAINT "FK_89c064d26eded5f62a7a7efc777"`);
        await queryRunner.query(`ALTER TABLE "seats" DROP CONSTRAINT "FK_1e41697b2e0b74c477ad51867ca"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_743b9fb1d2a059f2f7860418e4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e86edf76dc2424f123b9023a2b"`);
        await queryRunner.query(`DROP TABLE "payments"`);
        await queryRunner.query(`DROP TYPE "public"."payments_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a3cc9fd502f91b02c0ff8f0973"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_64cd97487c5c42806458ab5520"`);
        await queryRunner.query(`DROP TABLE "bookings"`);
        await queryRunner.query(`DROP TYPE "public"."bookings_status_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ec789a6fbf7fadb8b43b4b4f0f"`);
        await queryRunner.query(`DROP TABLE "shows"`);
        await queryRunner.query(`DROP TYPE "public"."shows_status_enum"`);
        await queryRunner.query(`DROP TABLE "screens"`);
        await queryRunner.query(`DROP TABLE "theatres"`);
        await queryRunner.query(`DROP TABLE "seats"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5aa0bbd146c0082d3fc5a0ad5d"`);
        await queryRunner.query(`DROP TABLE "movies"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }

}
