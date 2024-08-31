import { testContext } from './describe';

export type HookType = 'beforeAll' | 'beforeEach' | 'afterEach' | 'afterAll';

export type HooksRegistry = {
	callbacks: {
		[Type in HookType]: () => void;
	};
	set: (type: HookType, cb: () => void) => void;
	run: (type: HookType) => void;
};

export const beforeAll = createHook('beforeAll');
export const beforeEach = createHook('beforeEach');
export const afterEach = createHook('afterEach');
export const afterAll = createHook('afterAll');

export function createHooksRegistry(): HooksRegistry {
	const hooks: HooksRegistry = {
		callbacks: {
			beforeAll: () => {},
			beforeEach: () => {},
			afterEach: () => {},
			afterAll: () => {},
		},
		set: (type, cb) => {
			hooks.callbacks[type] = cb;
		},
		run: (type) => {
			hooks.callbacks[type]();
		},
	};

	return hooks;
}

function createHook(type: HookType) {
	return (cb: () => void) => {
		const context = testContext.use();

		if (!context) {
			throw new Error(
				`${type}() must be called within a describe() block`,
			);
		}

		context.hooks.set(type, cb);
	};
}
