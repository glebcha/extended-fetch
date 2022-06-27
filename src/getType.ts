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
  'Object',
  'Symbol',
  'Null',
  'Promise',
];
const specialCheckFunctions = { Date: (value: unknown): boolean => (value instanceof Date) };

const checkFunctions: CheckFunctions = checkTypes.reduce((checkers, type) => ({
  ...checkers,
  [type]: modifier(type),
}), { ...specialCheckFunctions });

export { checkFunctions as is };
