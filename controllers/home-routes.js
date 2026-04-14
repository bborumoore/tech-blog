const router = require('express').Router();
const { Post, Comment, User } = require('../models/');

const normalizeNextPath = (value) => {
  if (typeof value !== 'string') {
    return '';
  }
  if (!value.startsWith('/') || value.startsWith('//')) {
    return '';
  }
  return value;
};

// Renders all posts for homepage
router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [User],
      order: [['createdAt', 'DESC']],
    });

    // Map method creats an array of all needed posts
    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('all-posts', {
      posts,
      loggedIn: Boolean(req.session.loggedIn),
      username: req.session.username || null,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// get single post gy the ID
router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        User,
        {
          model: Comment,
          include: [User],
        },
      ],
    });

    if (postData) {
      const post = postData.get({ plain: true });

      res.render('single-post', {
        post,
        loggedIn: Boolean(req.session.loggedIn),
        username: req.session.username || null,
      });
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// reroute to the homepage if logged in
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect(req.query.next || '/');
    return;
  }

  const nextPath = normalizeNextPath(req.query.next);
  res.render('login', {
    nextPath,
    loggedIn: false,
  });
});

// reroute to the homepage if logged in
router.get('/signup', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('signup', {
    loggedIn: false,
  });
});

module.exports = router;
