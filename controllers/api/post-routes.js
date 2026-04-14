const router = require('express').Router();
const { Post } = require('../../models/');
const withAuth = require('../../utils/auth');

const normalizePostPayload = (payload) => {
  const title = typeof payload.title === 'string' ? payload.title.trim() : '';
  const body = typeof payload.body === 'string' ? payload.body.trim() : '';
  return { title, body };
};

// Allow a logged in user to create a new post
router.post('/', withAuth, async (req, res) => {
  try {
    const { title, body } = normalizePostPayload(req.body);
    if (!title || !body) {
      res.status(400).json({ message: 'Title and body are required.' });
      return;
    }

    const newPost = await Post.create({ title, body, userId: req.session.userId });
    res.json(newPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to update a specific post by it's ID
router.put('/:id', withAuth, async (req, res) => {
  try {
    const { title, body } = normalizePostPayload(req.body);
    if (!title || !body) {
      res.status(400).json({ message: 'Title and body are required.' });
      return;
    }

    const [affectedRows] = await Post.update({ title, body }, {
      where: {
        id: req.params.id,
        userId: req.session.userId,
      },
    });

    if (affectedRows > 0) {
      res.status(200).end();
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Route to delete a post by ID
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const affectedRows = await Post.destroy({
      where: {
        id: req.params.id,
        userId: req.session.userId,
      },
    });

    if (affectedRows > 0) {
      res.status(200).end();
    } else {
      res.status(404).end();
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
