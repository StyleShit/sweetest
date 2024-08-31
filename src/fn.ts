type Implementation = (...args: any[]) => any;

export type MockFn<T extends Implementation = Implementation> = T & {
	calls: Array<Parameters<T>>;
};

export function fn<T extends Implementation>(implementation?: T): MockFn<T> {
	implementation ??= (() => null) as T;

	const mock = ((...args: Parameters<Implementation>) => {
		mock.calls.push(args as Parameters<T>);

		return implementation(...args);
	}) as MockFn<T>;

	mock.calls = [];

	return mock;
}
