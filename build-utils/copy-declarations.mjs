import { copyFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const declarations = [
  'global.d.ts',
  'types.d.ts',
  'middleware/auth/types.d.ts'
];

await Promise.all(
  declarations.map(async declaration => {
    const source = path.join('src', declaration);
    const destination = path.join('build', 'es', declaration);

    await mkdir(path.dirname(destination), { recursive: true });
    await copyFile(source, destination);
  })
);
