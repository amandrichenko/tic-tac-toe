module.exports = {
    extends: [
        "@commitlint/config-conventional"
    ],
    "rules": {
        "header-max-length": [2, "always", 72],
        "subject-case": [2, "always", 'sentence-case'],
        "subject-full-stop": [2, "never", '.'],
        "header-min-length": [2, "always", 7],
        "scope-empty": [2, "always"],
        "scope-case": [2, "always", 'lower-case'],
        "scope-enum": [2, "always", ['test-scope-el', 'test-scope-another-el']],
        "body-max-length": [2, "always", 72],

    }
}
//
// parserPreset: {
//     parserOpts: {
//         issuePrefixes: ['PROJ-']
//     }
// },
