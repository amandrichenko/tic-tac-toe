module.exports = {
    extends: [
        "@commitlint/config-conventional"
    ],
    "rules": {
        "header-max-length": [2, "always", 72],
        "type-enum": [2, "always", ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'revert']],
        "scope-empty": [2, "never"],
        "scope-case": [2, "always", 'lower-case'],
        "scope-enum": [2, "always", ['test-scope-el', 'test-scope-another-el']],
        "subject-empty": [2, "never"],
        "subject-case": [2, "always", 'sentence-case'],
        "subject-min-length": [2, "always", 4],
        "subject-full-stop": [2, "never", '.'],
        "body-max-length": [2, "always", 72],
        'references-empty': [2, 'never']
    },
}
//
// parserPreset: {
//     parserOpts: {
//         issuePrefixes: ['PROJ-']
//     }
// },
