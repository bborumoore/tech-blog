const { startServer } = require('./app');

startServer().catch(() => {
  process.exit(1);
});
