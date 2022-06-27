import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import esbuild from 'rollup-plugin-esbuild-transform'
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import renameNodeModules from 'rollup-plugin-rename-node-modules';

export function getInputOptions({ moduleType, names, proxy, paths }) {
  const isESM = moduleType === 'es';
  const isProduction = process.env.NODE_ENV === 'production';
  const esbuildConfig = ['js', 'jsx', 'ts', 'tsx'].reduce((config, loader) => [{ loader }, ...config],
  [{
    minify: isProduction,
    output: true,
    sourcemap: true,
    treeShaking: true,
    target: 'es2017'
  }]);

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
        esbuild(esbuildConfig),
        commonjs({
          ignoreGlobal: false,
          sourceMap: false,
          include: '**/node_modules/**',
        }),
        isESM && renameNodeModules('esm-dependencies', false),
        !isESM && sizeSnapshot(),
    ],
  };

  return input;
}
