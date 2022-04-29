module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts?$': 'ts-jest',
  },
  "modulePaths": ["<rootDir>/src"],
  transformIgnorePatterns: ['./node_modules/'],
};

