const moduleNameMapper = {
    '^vue$': '@vue',
}

module.exports = {
    testRegex: 'spec.js$',
    moduleFileExtensions: ['js', 'vue'],
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    transformIgnorePatterns: ['/node_modules(?![\\\\/]vue-test-utils-compat[\\\\/])'],
    coverageDirectory: './coverage/',
    testEnvironmentOptions: {
        pretendToBeVisual: true
    },
    setupFilesAfterEnv: ['./tests/setup.js']
}