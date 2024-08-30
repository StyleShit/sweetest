import { matchers, type Matchers } from './matchers';

type NormalizeMatchers<TValue> = {
	[K in keyof Matchers]: Parameters<Matchers[K]>['length'] extends 1
		? () => void
		: (expected: TValue) => void;
};

export function expect<TValue>(value: TValue): NormalizeMatchers<TValue> {
	const _matchers = Object.entries(matchers).map(([name, matcher]) => {
		return [
			name,
			(expected: TValue) => {
				matcher(value, expected);
			},
		] as const;
	});

	return Object.fromEntries(_matchers) as never;
}

export class AssertionError extends Error {}
