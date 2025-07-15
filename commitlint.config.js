/**
 * SPDX-License-Identifier: MIT
 */

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Add any custom rules here
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
      ],
    ],
    'subject-case': [0], // Disable case checking for subject
  },
};
