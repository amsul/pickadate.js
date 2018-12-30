import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import flow from 'rollup-plugin-flow'
import nodeResolve from 'rollup-plugin-node-resolve'

export default {
  input: 'lib/pickadate/browser.js',
  output: [
    {
      file: 'dist/pickadate.browser.js',
      format: 'umd',
      exports: 'default',
      name: 'pickadate',
    },
  ],
  plugins: [
    flow(),
    babel({
      exclude: 'node_modules/**',
    }),
    commonjs(),
    nodeResolve(),
  ],
}
