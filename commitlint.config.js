module.exports = {
  plugins: ['commitlint-plugin-jira-rules'],
  extends: [
    '@commitlint/config-conventional',
    // 'jira',
  ],
  rules: {
    'header-max-length': [2, 'always', 72],
    // "type-enum": [2, "always", ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'revert', 'ci']],
    // "scope-empty": [2, "never"],
    'scope-case': [2, 'always', 'lower-case'],
    'scope-enum': [2, 'always', ['ui', 'logic']],
    // "subject-empty": [2, "never"],
    'subject-case': [2, 'always', 'sentence-case'],
    'subject-min-length': [2, 'always', 4],
    'subject-full-stop': [2, 'never', '.'],
    'body-max-length': [2, 'always', 72],
    // 'references-empty': [2, 'never']
  },
}
// parserPreset: {
//     parserOpts: {
//         // referenceActions: null, // You can set referenceActions to null, because the default value is an array [ 'close', 'closes', 'closed', 'fix', 'fixes', 'fixed', 'resolve', 'resolves', 'resolved' ]
//         // These keywords are used to reference an issue, they have to be followed by issue number if it's not null.
//         //
//         // https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-commits-parser#readme
//         issuePrefixes: ['IV-']
//     }
// },
