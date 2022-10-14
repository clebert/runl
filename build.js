import { build } from 'esbuild';

await build({
  entryPoints: ['./src/index.ts', './src/run-lambda.ts'],
  bundle: true,
  outdir: './dist',
  platform: 'node',
  tsconfig: 'tsconfig.json',
  format: 'esm',
  target: 'es2022'
});
