const defaultCRAJestConfig = require('./jest.default-cra.config')

module.exports = {
  ...defaultCRAJestConfig,
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/api/**/*.ts',
    '!<rootDir>/src/api/**/*.test.ts',
    '!**/node_modules/**',
    // FIXME: TODO: Get tests on the following. This is related to issues 52 and 64.
    // Currently we are unable to test the following because the code won't hit the
    // code branch that leads to this error being thrown. If we test against the
    // production API or a more sophisticated mock, then we may be able.
    '!<rootDir>/src/api/UnauthorizedError.ts',
    '!<rootDir>/src/test-helpers/**',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  setupFilesAfterEnv: ['isomorphic-fetch'],
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).ts?(x)'],
  testTimeout: 120000,
}
