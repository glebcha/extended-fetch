import path from 'path';
import glob from 'fast-glob';
import { cp } from 'fs/promises';
import { readConfig } from './readConfig.mjs';

const { types = {} } = await readConfig('.buildrc');
const exclusionsList = types.exclusions?.list ?? [];
const ignore = `${types.exclusions?.path ?? ''}/!(${exclusionsList.join('|')}).*`;
const destinationBaseDir = path.join('build', 'es');

glob(['src/**/*.d.ts'], { ignore })
	.then(sources => Promise.allSettled(
		sources.map(source => {
			const destination = source.replace(/^src/, destinationBaseDir);

			return cp(source, destination);
		})
	));
