import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import esbuild from 'rollup-plugin-esbuild'
import filesize from 'rollup-plugin-filesize';

export function getInputOptions({ moduleType, names, paths }) {
  const isESM = moduleType === 'es';
  const isProduction = process.env.NODE_ENV === 'production';

  const input = {
    input: paths.input,
    plugins: [
        replace({
          preventAssignment: true,
          'process.env.NODE_ENV': JSON.stringify('production'),
          'process.env.LIB_ID': JSON.stringify(names.global),
        }),
        nodeResolve({
          mainFields: ['jsnext:main', 'module', 'browser', 'main'],
          extensions: ['.js', '.jsx'],
        }),
        esbuild({ minify: isProduction }),
        commonjs({
          ignoreGlobal: false,
          sourceMap: false,
          include: '**/node_modules/**',
        }),
        !isESM && filesize({ showBrotliSize: true }),
    ],
  };

  return input;
}
