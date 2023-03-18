const path = require('path')
const { build } = require('esbuild')

const input = path.resolve(process.cwd(), 'src/index')
const outdir = path.resolve(process.cwd(), 'dist');

build({
  entryPoints: [input],
  format: 'esm',
  bundle: true,
  outfile: path.resolve(outdir, 'index.esm.js'),
  external: [
    'react',
    'react-dom'
  ]
})

build({
  entryPoints: [input],
  format: 'cjs',
  bundle: true,
  outfile: path.resolve(outdir, 'index.cjs'),
  external: [
    'react',
    'react-dom'
  ]
})