module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    // Note: Dot directories (e.g., .storybook) are also excluded automatically.
    '**/*.{ts,tsx}',
    '!**/*stories.tsx',
    '!**/node_modules/**',
    '!<rootDir>/api/**', // We test these with integration tests.
    '!<rootDir>/coverage/**',
    '!<rootDir>/e2e/**',
    '!<rootDir>/pages/**', // We test these with e2e tests.
    '!<rootDir>/public/**',
    '!<rootDir>/styles/**',
    '!<rootDir>/templates/**',
    '!<rootDir>/test-helpers/**',
    '!<rootDir>/__tests__/**',
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
  // Adds special extended assertions to Jest, thus simplifying the tests.
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect', '<rootDir>/test-helpers/unit-test-setup.ts'],
  testPathIgnorePatterns: ['/__tests__/', '/e2e/', '/node_modules/'],
  testTimeout: 180000,
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
}
