const moduleNameMapper = {
    '^vue$': '@vue',
}

module.exports = {
    testRegex: 'spec.js$',
    moduleFileExtensions: ['js', 'vue'],
    transform: {
        '^.+\\.js$': 'babel-jest'
    },
    transformIgnorePatterns: ['/node_modules(?![\\\\/])'],
    coverageDirectory: './coverage/',
    testEnvironmentOptions: {
        pretendToBeVisual: true
    },
    setupFilesAfterEnv: ['./tests/setup.js']
}