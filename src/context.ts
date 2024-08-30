export function createContext<T>(initialValue: T) {
	let value = initialValue;

	const provide = (newValue: T, cb: () => void) => {
		const prevValue = value;

		value = newValue;

		cb();

		value = prevValue;
	};

	const use = () => {
		return value;
	};

	return {
		provide,
		use,
	};
}
