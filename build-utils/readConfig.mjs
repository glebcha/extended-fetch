import { access, readFile } from 'fs/promises';

import { yellow } from 'colorette';

export function readConfig(configPath) {
  return access(configPath)
    .then(() => readFile(configPath))
    .then(json => JSON.parse(json))
    .catch((error) => {
      console.log(yellow(`\nCan't read configuration file ${configPath}\n`));

      return {};
    });
}