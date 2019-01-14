import fs from 'fs'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import flow from 'rollup-plugin-flow'
import postcss from 'rollup-plugin-postcss'
import nodeResolve from 'rollup-plugin-node-resolve'
import nodeGlobals from 'rollup-plugin-node-globals'
import svgo from 'rollup-plugin-svgo'

import pkg from './package.json'

const getConfig = ({ input, output }) => ({
  input,
  output: {
    ...output,
    format: 'umd',
    exports: 'default',
    banner: `/* pickadate v${pkg.version}, @license MIT */`,
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
  },
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

const getCoreConfig = (input, output) =>
  getConfig({
    input: `lib/${input}.js`,
    output: {
      file: `builds/${output}.js`,
      name: 'pickadate',
    },
  })

const getTranslationConfig = translation => {
  const path = `translations/${translation}`
  return getConfig({
    input: `lib/${path}`,
    output: {
      file: `builds/${path}`,
      name: `pickadate.translations.${translation.replace(/\.js$/, '')}`,
    },
  })
}

export default [
  getCoreConfig('apis/dom/index', 'index'),
  getCoreConfig('apis/dom/vanilla', 'vanilla'),
  getCoreConfig('apis/react-dom/index', 'react-dom'),
  getCoreConfig('apis/react-native/index', 'react-native'),
  getCoreConfig('apis/jquery/index', 'jquery'),
  ...fs
    .readdirSync('./lib/translations')
    .filter(name => /\.js$/.test(name))
    .map(translation => getTranslationConfig(translation)),
]
