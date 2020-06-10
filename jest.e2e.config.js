module.exports = {
  collectCoverageFrom: [
    '<rootDir>/pages/**/*.{ts,tsx}',
    '!**/node_modules/**',
    // FIXME: TODO: Get tests on the following. Issue #114.
    '!<rootDir>/pages/_app.tsx',
    '!<rootDir>/pages/auth.tsx',
    '!<rootDir>/pages/index.tsx',
    '!<rootDir>/pages/experiments/[id].tsx',
    '!<rootDir>/pages/experiments/[id]/results.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },

  preset: 'jest-puppeteer',
  testMatch: ['**/e2e/**/?(*.)+(spec|test).ts?(x)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
}
