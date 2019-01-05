import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import flow from 'rollup-plugin-flow'
import postcss from 'rollup-plugin-postcss'
import nodeResolve from 'rollup-plugin-node-resolve'
import nodeGlobals from 'rollup-plugin-node-globals'
import svgo from 'rollup-plugin-svgo'

const getBrowserConfig = (input, output) => ({
  input: `lib/pickadate/browser/${input}.js`,
  output: [
    {
      file: `dist/pickadate/${output}.js`,
      format: 'umd',
      exports: 'default',
      name: 'pickadate',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
    },
  ],
  external: ['react', 'react-dom'],
  plugins: [
    babel({
      exclude: 'node_modules/**',
    }),
    flow(),
    commonjs(),
    nodeResolve(),
    nodeGlobals({
      global: false,
      buffer: false,
      dirname: false,
      filename: false,
      baseDir: false,
    }),
    postcss(),
    svgo(),
  ],
})

export default [
  getBrowserConfig('index', 'browser'),
  getBrowserConfig('api', 'browser/vanilla'),
  getBrowserConfig('react', 'browser/react'),
]
