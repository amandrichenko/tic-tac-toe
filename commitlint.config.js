module.exports = {
    extends: [
        "@commitlint/config-conventional"
    ],
    "rules": {
        "header-max-length": [2, "always", 72],
        "header-case": [2, "always", 'Sentence case'],
        "header-fill-stop": [2, "always", '.'],
        "header-min-length": [2, "always", 4],
        "scope-empty": [2, "always"],
        "scope-case": [2, "always", 'lower-case'],
        "scope-enum": [2, "always", ['test-scope-el', 'test-scope-another-el']],
    }
}
