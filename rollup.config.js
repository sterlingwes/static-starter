const babel = require('rollup-plugin-babel');
const transpiler = babel({ exclude: 'node_modules/**' })

module.exports = {
  format: 'iife',
  entry: './dev/scripts/main.js',
  dest: './public/bundle.js',
  plugins: [ transpiler ]
}
