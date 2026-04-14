const router = require('express').Router();
const { Post } = require('../../models/');
const withAuth = require('../../utils/auth');

const normalizePostPayload = (payload) => {
  const title = typeof payload.title === 'string' ? payload.title.trim() : '';
  const body = typeof payload.body === 'string' ? payload.body.trim() : '';
  return { title, body };
};

const validatePostPayload = ({ title, body }) => {
  if (!title || !body) {
    return 'Title and body are required.';
  }

  if (title.length > 255) {
    return 'Title must be 255 characters or fewer.';
  }

  if (body.length > 5000) {
    return 'Body must be 5000 characters or fewer.';
  }

  return null;
};

// Allow a logged in user to create a new post
router.post('/', withAuth, async (req, res) => {
  try {
    const { title, body } = normalizePostPayload(req.body);
    const validationError = validatePostPayload({ title, body });
    if (validationError) {
      res.status(400).json({ message: validationError });
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
    const validationError = validatePostPayload({ title, body });
    if (validationError) {
      res.status(400).json({ message: validationError });
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
