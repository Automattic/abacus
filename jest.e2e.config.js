module.exports = {
  preset: 'jest-puppeteer',
  testMatch: ['**/e2e/**/?(*.)+(spec|test).ts?(x)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
}
