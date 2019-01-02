import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import flow from 'rollup-plugin-flow'
import postcss from 'rollup-plugin-postcss'
import nodeResolve from 'rollup-plugin-node-resolve'
import svgo from 'rollup-plugin-svgo'

const getBrowserConfig = (input, output) => ({
  input: `lib/pickadate/browser/${input}.js`,
  output: [
    {
      file: `dist/pickadate/${output}.js`,
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
    postcss(),
    svgo(),
  ],
})

export default [
  getBrowserConfig('index', 'browser'),
  getBrowserConfig('api', 'browser/vanilla'),
]
