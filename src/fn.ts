type AnyFunction = (...args: any[]) => any;

export type MockFn<T extends AnyFunction = AnyFunction> = T & {
	calls: Array<Parameters<T>>;
};

export function fn<T extends AnyFunction>(implementation?: T): MockFn<T> {
	implementation ??= (() => null) as T;

	const mock = ((...args: Parameters<AnyFunction>) => {
		mock.calls.push(args as Parameters<T>);

		return implementation(...args);
	}) as MockFn<T>;

	mock.calls = [];

	return mock;
}
