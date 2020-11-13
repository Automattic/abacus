const defaultCRAJestConfig = require('./jest.default-cra.config')

module.exports = {
  ...defaultCRAJestConfig,
  collectCoverage: true,
  collectCoverageFrom: [
    // Note: Dot directories (e.g., .storybook) are also excluded automatically.
    '<rootDir>/src/**/*.{ts,tsx}',
    '!**/*stories.tsx',
    '!**/node_modules/**',
    '!<rootDir>/e2e/**',
    '!<rootDir>/templates/**',
    '!<rootDir>/src/App.tsx',
    '!<rootDir>/src/index.tsx',
    '!<rootDir>/src/serviceWorker.ts',
    '!<rootDir>/src/api/**', // We test these with integration tests.
    '!<rootDir>/src/coverage/**',
    '!<rootDir>/src/pages/**', // We test these with e2e tests.
    '!<rootDir>/src/pages-real/**', // We test these with e2e tests.
    '!<rootDir>/src/public/**',
    '!<rootDir>/src/Routes.tsx', // We test these with e2e tests.
    '!<rootDir>/src/styles/**',
    '!<rootDir>/src/test-helpers/**',
    '!<rootDir>/src/__tests__/**',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },

  // Adds special extended assertions to Jest, thus simplifying the tests.
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect', '<rootDir>/src/test-helpers/unit-test-setup.ts'],
  testPathIgnorePatterns: ['/src/__tests__/', '/e2e/', '/node_modules/'],
  testTimeout: 180000,
}
