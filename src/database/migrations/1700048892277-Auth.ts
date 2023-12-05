import { MigrationInterface, QueryRunner } from 'typeorm';

export class Auth1700048892277 implements MigrationInterface {
  name = 'Auth1700048892277';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`access-tokens\`
                             (
                                 \`id\`      int          NOT NULL AUTO_INCREMENT,
                                 \`userId\`  int          NOT NULL,
                                 \`tokenId\` varchar(255) NOT NULL,
                                 PRIMARY KEY (\`id\`)
                             ) ENGINE=InnoDB`);
    await queryRunner.query(`ALTER TABLE \`users\`
        ADD \`roles\` text NOT NULL`);
    await queryRunner.query(`ALTER TABLE \`access-tokens\`
        ADD CONSTRAINT \`FK_d1c4c29819ccdb95a24d90a4b42\` FOREIGN KEY (\`userId\`) REFERENCES \`users\` (\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`access-tokens\` DROP FOREIGN KEY \`FK_d1c4c29819ccdb95a24d90a4b42\``,
    );
    await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`roles\``);
    await queryRunner.query(`DROP TABLE \`access-tokens\``);
  }
}
