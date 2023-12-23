// import { MigrationInterface, QueryRunner } from 'typeorm';

// export class Init1684675308359 implements MigrationInterface {
//   name = 'Init1684675308359';

//   public async up(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(`DROP TYPE IF EXISTS user_role_enum`);
//     await queryRunner.query(
//       `CREATE TYPE user_role_enum AS ENUM ('ADMIN','USER')`,
//     );
//     await queryRunner.query(
//       `CREATE TABLE "video" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "")`,
//     );
//     await queryRunner.query(`DROP TYPE IF EXISTS user_role_enum`);
//     await queryRunner.query(`DROP TYPE IF EXISTS user_role_enum`);
//     await queryRunner.query(`DROP TYPE IF EXISTS user_role_enum`);
//     await queryRunner.query(`DROP TYPE IF EXISTS user_role_enum`);
//   }
// }
