import { is } from '../getType';

function safeJsonStringifyReplacer(seen: WeakSet<object>) {
	return function (_key: string | number, value: unknown) {
		if (is.Object(value) && typeof value?.toJSON === 'function') {
			value = value.toJSON();
		}

		if (!(value !== null && typeof value === 'object')) {
			return value;
		}

		if (seen.has(value)) {
			return '[Circular]';
		}

		seen.add(value);

		const newValue = (Array.isArray(value) ? [] : {}) as unknown[] & Record<string, unknown>;

		for (const [innerKey, innerValue] of Object.entries(value)) {
			newValue[innerKey] = safeJsonStringifyReplacer(seen)(innerKey, innerValue);
		}

		seen.delete(value);

		return newValue;
	};
}

export function safeJsonStringify(data: unknown, space?: string | number) {
	const seen = new WeakSet();

	return JSON.stringify(data, safeJsonStringifyReplacer(seen), space);
}
