import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1766772835785 implements MigrationInterface {
    name = 'InitSchema1766772835785'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "shows" DROP CONSTRAINT "no_overlapping_shows"`);
        await queryRunner.query(`CREATE TYPE "public"."users_logintype_enum" AS ENUM('PASSWORD', 'GOOGLE')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "loginType" "public"."users_logintype_enum" NOT NULL DEFAULT 'PASSWORD'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "isVerified" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "passwordHash"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "passwordHash" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "passwordHash"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "passwordHash" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isVerified"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "loginType"`);
        await queryRunner.query(`DROP TYPE "public"."users_logintype_enum"`);
        await queryRunner.query(`ALTER TABLE "shows" ADD CONSTRAINT "no_overlapping_shows" EXCLUDE USING gist (screen_id WITH =, tsrange("startTime", "endTime") WITH &&)`);
    }

}
