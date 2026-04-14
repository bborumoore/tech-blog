require('dotenv').config();

const buildConfigForEnv = (envName) => {
  const dbDialect = process.env.DB_DIALECT || 'mysql';
  const dbName = process.env.DB_NAME || 'tech_blog_db';
  const dbUser = process.env.DB_USER || 'root';
  const dbPassword = process.env.DB_PASSWORD || '';
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = Number(process.env.DB_PORT || 3306);
  const sqliteStorage = process.env.DB_STORAGE || (envName === 'test' ? ':memory:' : 'db/tech-blog.sqlite');

  if (dbDialect === 'sqlite') {
    return {
      dialect: 'sqlite',
      storage: sqliteStorage,
      logging: false,
    };
  }

  if (envName === 'production' && process.env.JAWSDB_URL) {
    return {
      use_env_variable: 'JAWSDB_URL',
      dialect: 'mysql',
      dialectOptions: {
        decimalNumbers: true,
      },
      logging: false,
    };
  }

  return {
    username: dbUser,
    password: dbPassword,
    database: dbName,
    host: dbHost,
    port: dbPort,
    dialect: 'mysql',
    dialectOptions: {
      decimalNumbers: true,
    },
    logging: false,
  };
};

module.exports = {
  development: buildConfigForEnv('development'),
  test: buildConfigForEnv('test'),
  production: buildConfigForEnv('production'),
};
