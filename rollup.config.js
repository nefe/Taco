import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import typescript from 'rollup-plugin-typescript';

// `npm run build` -> `production` is true
// `npm run dev` -> `production` is false
const production = !process.env.ROLLUP_WATCH;

export default {
  entry: 'src/demo.ts',
  dest: 'public/bundle.js',
  format: 'iife', // immediately-invoked function expression — suitable for <script> tags
  plugins: [
    resolve(), // tells Rollup how to find date-fns in node_modules
    commonjs(), // converts date-fns to ES modules
    typescript({
      typescript: require('typescript') // use local version
    }),
    production && uglify() // minify, but only in production
  ],
  sourceMap: true
};
