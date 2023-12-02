import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import esbuild from 'rollup-plugin-esbuild'
import filesize from 'rollup-plugin-filesize';
import renameNodeModules from 'rollup-plugin-rename-node-modules';

export function getInputOptions({ moduleType, paths }) {
  const isESM = moduleType === 'es';
  const isProduction = process.env.NODE_ENV === 'production';

  const input = {
    input: paths.input,
    plugins: [
        replace({
          preventAssignment: true,
          'process.env.NODE_ENV': JSON.stringify('production'),
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
        isESM && renameNodeModules('esm-dependencies', false),
        !isESM && filesize({ showBrotliSize: true }),
    ],
  };

  return input;
}
