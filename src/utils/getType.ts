interface CheckFunctions {
  [checkType: string]: (value: unknown) => boolean
}

const modifier = (type: string) => (item: unknown) => Object.prototype.toString.call(item) === `[object ${type}]`;

const checkTypes: Array<string> = [
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
];
const specialCheckFunctions = {
  Date: (value: unknown): boolean => (value instanceof Date),
  Object: isObject,
  Headers: isHeaders,
};

const checkFunctions = checkTypes.reduce<CheckFunctions & typeof specialCheckFunctions>((checkers, type) => ({
  ...checkers,
  [type]: modifier(type),
}), { ...specialCheckFunctions });

function isObject(income: unknown): income is Record<string | number | symbol, unknown> {
  return Object.prototype.toString.call(income) === '[object Object]';
}

function isHeaders(income: unknown): income is Headers {
  return Object.prototype.toString.call(income) === '[object Headers]';
}

export { checkFunctions as is };
