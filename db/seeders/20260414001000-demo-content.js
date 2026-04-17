'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const hashedPassword = await bcrypt.hash('password123', 10);

    await queryInterface.bulkInsert('User', [
      {
        username: 'demo-author',
        password: hashedPassword,
      }
    ]);

    const [users] = await queryInterface.sequelize.query(
      "SELECT id FROM `User` WHERE username = 'demo-author' LIMIT 1"
    );
    const userId = users[0].id;

    await queryInterface.bulkInsert('Posts', [
      {
        title: 'Welcome to the Tech Blog',
        body: 'This starter post confirms migrations and seeders are wired correctly.',
        userId,
        createdAt: now,
        updatedAt: now,
      }
    ]);

    const [posts] = await queryInterface.sequelize.query(
      "SELECT id FROM `Posts` WHERE title = 'Welcome to the Tech Blog' LIMIT 1"
    );
    const postId = posts[0].id;

    await queryInterface.bulkInsert('Comments', [
      {
        body: 'Seeded comment: the CMS workflow is ready for development.',
        postId,
        userId,
        createdAt: now,
        updatedAt: now,
      }
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('Comments', null, {});
    await queryInterface.bulkDelete('Posts', null, {});
    await queryInterface.bulkDelete('User', null, {});
  }
};
