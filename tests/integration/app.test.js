process.env.NODE_ENV = 'test';
process.env.DB_DIALECT = 'sqlite';
process.env.DB_STORAGE = ':memory:';
process.env.SESSION_SECRET = 'test-session-secret';

const request = require('supertest');
const { app, sequelize } = require('../../app');
const { User, Post, Comment } = require('../../models');

const parseCsrfToken = (html) => {
  const tokenMatch = html.match(/name="csrf-token" content="([^"]+)"/);
  return tokenMatch ? tokenMatch[1] : '';
};

const fetchCsrfToken = async (agent, path = '/login') => {
  const response = await agent.get(path);
  expect(response.status).toBe(200);
  const token = parseCsrfToken(response.text);
  expect(token).toBeTruthy();
  return token;
};

describe('Tech Blog integration flows', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await Comment.destroy({ where: {} });
    await Post.destroy({ where: {} });
    await User.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('requires CSRF token for login and allows login with token', async () => {
    await User.create({
      username: 'alice',
      password: 'password123',
    });

    const agent = request.agent(app);
    const csrfToken = await fetchCsrfToken(agent);

    const missingCsrfResponse = await agent.post('/api/user/login').send({
      username: 'alice',
      password: 'password123',
    });
    expect(missingCsrfResponse.status).toBe(403);

    const successfulLoginResponse = await agent
      .post('/api/user/login')
      .set('x-csrf-token', csrfToken)
      .send({
        username: 'alice',
        password: 'password123',
      });
    expect(successfulLoginResponse.status).toBe(200);
    expect(successfulLoginResponse.body.message).toBe('You are now logged in!');
  });

  test('logged in user can create and edit own post, but cannot edit another user post', async () => {
    const author = await User.create({
      username: 'author-user',
      password: 'password123',
    });
    const intruder = await User.create({
      username: 'intruder-user',
      password: 'password123',
    });

    const ownPost = await Post.create({
      title: 'Original Title',
      body: 'Original body',
      userId: author.id,
    });

    const foreignPost = await Post.create({
      title: 'Foreign Title',
      body: 'Foreign body',
      userId: intruder.id,
    });

    const agent = request.agent(app);
    const csrfToken = await fetchCsrfToken(agent);

    await agent
      .post('/api/user/login')
      .set('x-csrf-token', csrfToken)
      .send({
        username: 'author-user',
        password: 'password123',
      })
      .expect(200);

    const authenticatedCsrfToken = await fetchCsrfToken(agent, '/dashboard');

    await agent
      .put(`/api/post/${ownPost.id}`)
      .set('x-csrf-token', authenticatedCsrfToken)
      .send({
        title: 'Updated Title',
        body: 'Updated body',
      })
      .expect(200);

    const updatedOwnPost = await Post.findByPk(ownPost.id);
    expect(updatedOwnPost.title).toBe('Updated Title');

    await agent
      .put(`/api/post/${foreignPost.id}`)
      .set('x-csrf-token', authenticatedCsrfToken)
      .send({
        title: 'Intruder Update',
        body: 'Should not update',
      })
      .expect(404);

    const unchangedForeignPost = await Post.findByPk(foreignPost.id);
    expect(unchangedForeignPost.title).toBe('Foreign Title');
  });

  test('comment flow enforces auth and associates comments to logged in user', async () => {
    const author = await User.create({
      username: 'post-owner',
      password: 'password123',
    });
    const commenter = await User.create({
      username: 'commenter',
      password: 'password123',
    });

    const post = await Post.create({
      title: 'Post for comments',
      body: 'Post body',
      userId: author.id,
    });

    const anonymousAgent = request.agent(app);
    const anonymousMissingCsrfResponse = await anonymousAgent.post('/api/comment').send({
      postId: post.id,
      body: 'Anonymous comment',
    });
    expect(anonymousMissingCsrfResponse.status).toBe(403);

    const anonymousCsrfToken = await fetchCsrfToken(anonymousAgent, '/');
    const anonymousResponse = await anonymousAgent
      .post('/api/comment')
      .set('x-csrf-token', anonymousCsrfToken)
      .send({
        postId: post.id,
        body: 'Anonymous comment',
      });
    expect(anonymousResponse.status).toBe(302);
    expect(anonymousResponse.headers.location).toMatch(/^\/login\?next=/);

    const agent = request.agent(app);
    const csrfToken = await fetchCsrfToken(agent);

    await agent
      .post('/api/user/login')
      .set('x-csrf-token', csrfToken)
      .send({
        username: 'commenter',
        password: 'password123',
      })
      .expect(200);

    const authenticatedCsrfToken = await fetchCsrfToken(agent, '/dashboard');

    const createCommentResponse = await agent
      .post('/api/comment')
      .set('x-csrf-token', authenticatedCsrfToken)
      .send({
        postId: post.id,
        body: 'Authenticated comment',
      });

    expect(createCommentResponse.status).toBe(200);
    expect(createCommentResponse.body.userId).toBe(commenter.id);
    expect(createCommentResponse.body.postId).toBe(post.id);

    const comments = await Comment.findAll({ where: { postId: post.id } });
    expect(comments).toHaveLength(1);
    expect(comments[0].body).toBe('Authenticated comment');
  });
});
