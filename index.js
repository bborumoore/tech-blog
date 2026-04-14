const path = require('path');
const express = require('express');
const session = require('express-session');
const { create } = require('express-handlebars');
const helpers = require('./utils/helpers');

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

const sequelize = require('./config/config');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

if (isProduction && !process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET must be set when NODE_ENV=production');
}

const sess = {
  secret: process.env.SESSION_SECRET || 'dev-only-session-secret-change-me',
  name: 'techblog.sid',
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    maxAge: 1000 * 60 * 60 * 24
  },
  resave: false,
  saveUninitialized: false,
  store: new SequelizeStore({
    db: sequelize
  })
};

if (isProduction) {
  app.set('trust proxy', 1);
}

app.use(session(sess));
app.disable('x-powered-by');

// Defining middleware for the app
const hbs = create({ helpers });

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(require('./controllers'));

const startServer = async () => {
  try {
    await sequelize.sync({ force: false });
    app.listen(PORT, () => {
      console.log(`App listening on port ${PORT}!`);
    });
  } catch (error) {
    console.error('Unable to start server', error);
    process.exit(1);
  }
};

startServer();
