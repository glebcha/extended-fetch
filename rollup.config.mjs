import { getInputOptions } from './build-utils/getInputOptions.mjs';
import { getOutputOptions } from './build-utils/getOutputOptions.mjs';
import { readConfig } from './build-utils/readConfig.mjs';

const [buildConfig, { version } = {}] = await Promise.all([
  readConfig('.buildrc'),
  readConfig('package.json')
]);

if (Object.keys(buildConfig).length === 0) {
  throw new Error('Missing ".buildrc" configuration file');
}

function configure(moduleType) {
  const params = {
    moduleType,
    version,
    ...buildConfig
  };
  const input = getInputOptions(params);
  const output = getOutputOptions(params);

  return { ...input, output };
};

const configs = ['es', 'umd'].map(configure);

export default configs;
