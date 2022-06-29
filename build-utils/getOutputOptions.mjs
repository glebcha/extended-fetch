import path from 'path';

export function getOutputOptions({ moduleType, version, names, paths }) {
  const isESM = moduleType === 'es';
  const footer = `
  if (globalThis.ExtendedFetch ) {
    globalThis.ExtendedFetch.version = '${version}';
  } else {
    globalThis.ExtendedFetch = {version: '${version}'};
  }
  `;

  const output = Object.assign(
    {
      format: moduleType,
      sourcemap: !isESM,
    },
    isESM ?
    {
      preserveModules: true,
      dir: path.join(paths.output, moduleType),
    } :
    {
      name: names.global,
      extend: true,
      footer,
      file: path.join(paths.output, moduleType, `${names.lib}.${moduleType}.js`),
    }
  );

  return output;
}
