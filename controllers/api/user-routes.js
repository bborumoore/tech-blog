const router = require('express').Router();
const { User } = require('../../models');

const startSession = (req, user) => new Promise((resolve, reject) => {
  req.session.regenerate((regenerateErr) => {
    if (regenerateErr) {
      reject(regenerateErr);
      return;
    }

    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.loggedIn = true;

    req.session.save((saveErr) => {
      if (saveErr) {
        reject(saveErr);
        return;
      }
      resolve();
    });
  });
});

// Create a new user, then log them in using sessions
router.post('/', async (req, res) => {
  try {
    const username = typeof req.body.username === 'string' ? req.body.username.trim() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    if (!username || password.length < 8) {
      res.status(400).json({ message: 'Username and password (min 8 chars) are required.' });
      return;
    }

    const newUser = await User.create({
      username,
      password,
    });

    await startSession(req, newUser);
    res.json(newUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Validate an existing user, then create a new session
router.post('/login', async (req, res) => {
  try {
    const username = typeof req.body.username === 'string' ? req.body.username.trim() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required.' });
      return;
    }

    const user = await User.findOne({
      where: {
        username,
      },
    });

    if (!user) {
      res.status(400).json({ message: 'Invalid username or password.' });
      return;
    }

    const validPassword = user.checkPassword(password);

    if (!validPassword) {
      res.status(400).json({ message: 'Invalid username or password.' });
      return;
    }

    await startSession(req, user);
    res.json({ user, message: 'You are now logged in!' });
  } catch (err) {
    res.status(500).json({ message: 'Unable to complete login.' });
  }
});

// Destroy a session
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(204).end();
  }
});

module.exports = router;
