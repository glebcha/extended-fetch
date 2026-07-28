import { defineConfig } from 'rolldown';

import packageJson from './package.json';
import {
  GLOBAL_NAME,
  sharedInputOptions,
  sharedOutputOptions
} from './build-config/rolldown.shared';

const input = 'src/index.ts';
const footer = `
if (globalThis.${GLOBAL_NAME}) {
  globalThis.${GLOBAL_NAME}.version = '${packageJson.version}';
} else {
  globalThis.${GLOBAL_NAME} = { version: '${packageJson.version}' };
}
`;

// biome-ignore lint/style/noDefaultExport: Rolldown needs it
export default defineConfig([
  {
    ...sharedInputOptions,
    input,
    output: {
      ...sharedOutputOptions,
      dir: 'build/es',
      entryFileNames: '[name].js',
      format: 'es',
      preserveModules: true
    }
  },
  {
    ...sharedInputOptions,
    input,
    output: {
      ...sharedOutputOptions,
      name: GLOBAL_NAME,
      extend: true,
      file: `build/umd/${packageJson.name}.umd.js`,
      footer,
      format: 'umd',
      generatedCode: {
        symbols: false
      },
      sourcemap: true,
      strict: true
    }
  }
]);
