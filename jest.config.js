/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^orders/(.*)$': '<rootDir>/src/orders/$1',
    '^db/(.*)$': '<rootDir>/src/db/$1',
  },
  roots: ['<rootDir>/src'],
};