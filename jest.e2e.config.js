module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['**/e2e/**/?(*.)+(spec|test).ts?(x)'],
  testTimeout: 120000,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
}
