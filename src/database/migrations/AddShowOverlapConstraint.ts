import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Migration: Prevent overlapping shows on the same screen
 *
 * WHY THIS EXISTS:
 * ----------------
 * In a movie booking system, a single screen cannot run
 * two shows at the same time.
 *
 * If this rule is enforced only in application code,
 * concurrent requests (or two admins) can bypass it.
 *
 * This migration enforces the rule at the DATABASE level,
 * making it impossible to insert overlapping shows,
 * even under heavy concurrency.
 */
export class AddShowOverlapConstraint1700000000000
  implements MigrationInterface
{
  /**
   * Runs when the migration is applied
   *
   * WHAT THIS DOES (HIGH LEVEL):
   * 1. Enables a PostgreSQL extension required for advanced indexing
   * 2. Adds a database constraint that blocks overlapping shows
   */
  public async up(queryRunner: QueryRunner): Promise<void> {

    /**
     * STEP 1: Enable btree_gist extension
     *
     * WHY:
     * - GiST indexes normally work with range types
     * - We also need to compare `screen_id` using `=`
     * - PostgreSQL requires the `btree_gist` extension
     *   to allow equality comparisons inside GiST indexes
     *
     * IF WE SKIP THIS:
     * - PostgreSQL will reject the constraint
     */
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS btree_gist;
    `);

    /**
     * STEP 2: Add exclusion constraint on `shows` table
     *
     * WHAT AN EXCLUSION CONSTRAINT DOES:
     * - It prevents inserting rows that "conflict"
     *   according to defined rules
     *
     * WHY WE USE IT:
     * - UNIQUE constraints are not enough
     * - We need to prevent TIME OVERLAPS, not just duplicates
     */
    await queryRunner.query(`
      ALTER TABLE shows
      ADD CONSTRAINT no_overlapping_shows
      EXCLUDE USING gist (

        /**
         * RULE 1:
         * Compare rows with the SAME screen_id
         *
         * Meaning:
         * - The overlap rule only applies within one screen
         * - Different screens can run shows at the same time
         */
        screen_id WITH =,

        /**
         * RULE 2:
         * Compare time ranges using tsrange
         *
         * tsrange(startTime, endTime) creates a time interval
         * Example:
         *   Show A → [10:00, 12:00)
         *   Show B → [11:00, 13:00)
         *
         * WITH && means:
         * - "time ranges must NOT overlap"
         *
         * If two ranges overlap, PostgreSQL REJECTS the insert
         */
        tsrange("startTime", "endTime") WITH &&
      );
    `);
  }

  /**
   * Runs when the migration is reverted
   *
   * WHY THIS EXISTS:
   * - Allows safe rollback
   * - Useful during development or emergency fixes
   *
   * WHAT IT DOES:
   * - Removes the overlap protection constraint
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE shows
      DROP CONSTRAINT IF EXISTS no_overlapping_shows;
    `);
  }
}
