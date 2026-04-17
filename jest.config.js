module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  collectCoverageFrom: [
    'controllers/**/*.js',
    'models/**/*.js',
    'utils/**/*.js',
    '!**/node_modules/**',
  ],
};
