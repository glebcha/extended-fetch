import type { InputOptions, OutputOptions } from 'rolldown';

export const GLOBAL_NAME = 'ExtendedFetch';

export const sharedInputOptions = {
  treeshake: {
    moduleSideEffects: false
  },
  transform: {
    define: {
      'process.env.LIB_ID': JSON.stringify(GLOBAL_NAME),
      'process.env.NODE_ENV': JSON.stringify('production')
    },
    target: 'es2020'
  }
} satisfies InputOptions;

export const sharedOutputOptions = {
  minify: true
} satisfies OutputOptions;
