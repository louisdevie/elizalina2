/* eslint-disable */

const tsESLint = require('typescript-eslint')
const baseCfg = require('./eslint.config')

module.exports = tsESLint.config(...baseCfg, ...tsESLint.configs.strictTypeCheckedOnly, {
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: __dirname,
    },
  },
})
