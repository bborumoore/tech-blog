const router = require('express').Router();
const { Comment, Post } = require('../../models/');
const withAuth = require('../../utils/auth');

// Allow a logged in user to create a new comment
router.post('/', withAuth, async (req, res) => {
  try {
    const body = typeof req.body.body === 'string' ? req.body.body.trim() : '';
    const postId = Number.parseInt(req.body.postId, 10);
    if (!body || body.length > 1000 || Number.isNaN(postId)) {
      res.status(400).json({ message: 'A valid post and comment body (max 1000 chars) are required.' });
      return;
    }

    const post = await Post.findByPk(postId);
    if (!post) {
      res.status(404).json({ message: 'Post not found.' });
      return;
    }

    const newComment = await Comment.create({
      body,
      postId,
      userId: req.session.userId,
    });
    res.json(newComment);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
