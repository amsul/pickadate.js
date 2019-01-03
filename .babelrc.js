module.exports = {
  presets: ['@babel/env', '@babel/flow', '@babel/preset-react'],
  plugins: [['@babel/plugin-proposal-class-properties', { loose: true }]],
}
