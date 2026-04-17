process.env.NODE_ENV = 'test';
process.env.DB_DIALECT = 'sqlite';
process.env.DB_STORAGE = ':memory:';

const { Sequelize } = require('sequelize');
const migrationConfig = require('../../config/sequelize-cli');

describe('sequelize-cli configuration', () => {
  test('test environment supports sqlite migrations in memory', async () => {
    expect(migrationConfig.test).toBeDefined();
    expect(migrationConfig.test.dialect).toBe('sqlite');
    expect(migrationConfig.test.storage).toBe(':memory:');

    const sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: migrationConfig.test.storage,
      logging: false,
    });

    await expect(sequelize.authenticate()).resolves.toBeUndefined();
    await sequelize.close();
  });
});
