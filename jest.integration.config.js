module.exports = {
  collectCoverageFrom: [
    '<rootDir>/api/**/*.ts',
    '!**/node_modules/**',
    // FIXME: TODO: Get tests on the following.
    '!<rootDir>/api/UnauthorizedError.ts',
    '!<rootDir>/api/utils.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  globals: {
    // Must specify a custom tsconfig for tests because we need the TypeScript
    // transform to transform JSX into js rather than leaving it as JSX which the
    // next build requires.
    'ts-jest': {
      babelConfig: true,
      tsConfig: '<rootDir>/tsconfig.jest.json',
    },
  },
  moduleNameMapper: {
    '@/(.*)': '<rootDir>/$1',
  },
  preset: 'ts-jest',
  setupFilesAfterEnv: ['isomorphic-fetch'],
  testMatch: ['**/__tests__/**/?(*.)+(spec|test).ts?(x)'],
}
