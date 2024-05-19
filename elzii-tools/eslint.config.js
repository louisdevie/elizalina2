/* eslint-disable */

const eslint = require('@eslint/js')
const tsESLint = require('typescript-eslint')

module.exports = tsESLint.config(
  eslint.configs.recommended,
  ...tsESLint.configs.strict,
  {
    ignores: ['**/gen/'],
  },
  {
    rules: {
      '@typescript-eslint/explicit-function-return-type': 'error',
      '@typescript-eslint/consistent-generic-constructors': ['error', 'type-annotation'],
      '@typescript-eslint/explicit-member-accessibility': 'error',
    },
  },
)
