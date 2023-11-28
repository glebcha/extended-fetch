import { is } from './getType';

type Entity = Record<string, unknown>

export function deepMerge(target: Entity, source: Entity) {
  Object.keys(source).forEach(key => {
    if (!Object.prototype.hasOwnProperty.call(target, key) || !is.Object(source[key])) {
      const areBothArrays = [target[key], source[key]].every(Array.isArray);

      target[key] = areBothArrays ? (target[key] as unknown[]).concat(source[key]) : source[key];
    } else {
      deepMerge(target[key] as Entity, source[key] as Entity);
    }
  });

  return target;
}
