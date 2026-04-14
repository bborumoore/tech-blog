const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;
const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';
const dbDialect = process.env.DB_DIALECT || 'mysql';

const localDbName = process.env.DB_NAME || 'tech_blog_db';
const localDbUser = process.env.DB_USER || 'root';
const localDbPassword = process.env.DB_PASSWORD || '';
const localDbHost = process.env.DB_HOST || 'localhost';
const localDbPort = Number(process.env.DB_PORT || 3306);
const sqliteStorage = process.env.DB_STORAGE || (nodeEnv === 'test' ? ':memory:' : 'db/tech-blog.sqlite');

if (dbDialect === 'sqlite') {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: sqliteStorage,
    logging: false,
  });
} else if (process.env.JAWSDB_URL) {
  sequelize = new Sequelize(process.env.JAWSDB_URL, {
    dialect: 'mysql',
    dialectOptions: {
      decimalNumbers: true,
    },
    logging: false,
  });
} else {
  if (isProduction && (!process.env.DB_NAME || !process.env.DB_USER)) {
    throw new Error('DB_NAME and DB_USER must be set when NODE_ENV=production');
  }

  sequelize = new Sequelize(
    localDbName,
    localDbUser,
    localDbPassword,
    {
      host: localDbHost,
      dialect: 'mysql',
      dialectOptions: {
        decimalNumbers: true,
      },
      port: localDbPort,
      logging: false
    }
  );
}

module.exports = sequelize;

