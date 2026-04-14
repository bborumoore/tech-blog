const router = require('express').Router();
const { Post } = require('../models/');
const withAuth = require('../utils/auth');

// Routes user to find/display all posts
router.get('/', withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      where: {
        userId: req.session.userId,
      },
      order: [['createdAt', 'DESC']],
    });

    const posts = postData.map((post) => post.get({ plain: true }));

    res.render('all-posts-admin', {
      layout: 'dashboard',
      posts,
      loggedIn: true,
      username: req.session.username,
    });
  } catch (err) {
    res.redirect('/login');
  }
});

// Route to get new post
router.get('/new', withAuth, (req, res) => {
  res.render('new-post', {
    layout: 'dashboard',
    loggedIn: true,
    username: req.session.username,
  });
});

// Route to allow user to edit a post by ID
router.get('/edit/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findOne({
      where: {
        id: req.params.id,
        userId: req.session.userId,
      },
    });

    if (postData) {
      const post = postData.get({ plain: true });

      res.render('edit-post', {
        layout: 'dashboard',
        post,
        loggedIn: true,
        username: req.session.username,
      });
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.redirect('/login');
  }
});

module.exports = router;
