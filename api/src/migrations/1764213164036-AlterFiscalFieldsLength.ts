import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterFiscalFieldsLength1732670000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Aumentar tamanho dos campos fiscais
    await queryRunner.query(`
      ALTER TABLE ingredients 
      ALTER COLUMN ncm TYPE VARCHAR(20),
      ALTER COLUMN cest TYPE VARCHAR(20),
      ALTER COLUMN cfop TYPE VARCHAR(20);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverter para tamanho original
    await queryRunner.query(`
      ALTER TABLE ingredients 
      ALTER COLUMN ncm TYPE VARCHAR(8),
      ALTER COLUMN cest TYPE VARCHAR(8),
      ALTER COLUMN cfop TYPE VARCHAR(8);
    `);
  }
}
