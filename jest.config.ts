import type { Config } from 'jest';

const config: Config = {
    verbose: true,
    setupFiles: [
        '<rootDir>/jest/setup.jest.js',
        '<rootDir>/jest/mock-extension-apis.js'
    ],
    testEnvironment: 'jsdom',

};

export default config;