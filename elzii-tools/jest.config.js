module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '@module/(.*)': '<rootDir>/src/$1',
    '@module': '<rootDir>/src/index',
  },
}
