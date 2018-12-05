module.exports = {
  extends: ['eslint:recommended'],
  plugins: ['flowtype'],
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  rules: {
    'flowtype/define-flow-type': 1,
    'flowtype/use-flow-type': 1,
    indent: ['error', 2],
    quotes: ['error', 'single'],
    'linebreak-style': ['error', 'unix'],
    'no-console': 'off',
    semi: ['error', 'never'],
  },
}
