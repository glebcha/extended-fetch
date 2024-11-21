const modifier = (type: string) => (item: unknown) => Object.prototype.toString.call(item) === `[object ${type}]`;

const checkTypes = [
  'Array',
  'AbortSignal',
  'AbortController',
  'String',
  'Function',
  'AsyncFunction',
  'Number',
  'Boolean',
  'Symbol',
  'Null',
  'Promise',
] as const;

const specialCheckFunctions = {
  Date: (value: unknown): boolean => (value instanceof Date),
  Object: isObject,
  Headers: isHeaders,
};

type CheckFunctions = typeof specialCheckFunctions & {
  [checkType in typeof checkTypes[number]]: (value: unknown) => boolean;
};

const checkFunctions = checkTypes.reduce((checkers, type) => ({
  ...checkers,
  [type]: modifier(type),
}), specialCheckFunctions as CheckFunctions);

function isObject(income: unknown): income is Record<string | number | symbol, unknown> {
  return Object.prototype.toString.call(income) === '[object Object]';
}

function isHeaders(income: unknown): income is Headers {
  return Object.prototype.toString.call(income) === '[object Headers]';
}

export { checkFunctions as is };
