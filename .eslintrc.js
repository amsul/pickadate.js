module.exports = {
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  plugins: ['flowtype', 'react'],
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  rules: {
    'flowtype/define-flow-type': 1,
    'flowtype/use-flow-type': 1,
    'no-console': 'off',
    'no-unused-vars': [2, { args: 'none', ignoreRestSiblings: true }],
  },
}
