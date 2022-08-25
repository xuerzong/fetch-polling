import ts from 'rollup-plugin-typescript2'
import { uglify } from 'rollup-plugin-uglify';

const pkg = require('./package.json')

export default [
  {
    input: pkg.source,
    output: [
      {
        format: 'cjs',
        file: pkg.main,
        sourcemap: true,
        exports: 'default'
      },
      {
        format: 'esm',
        file: pkg.module,
        sourcemap: true,
        exports: 'default'
      }
    ],
    plugins: [
      ts({ tsconfig: './tsconfig.build.json' }),
      uglify()
    ]
  }
]