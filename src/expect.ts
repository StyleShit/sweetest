import { matchers, type Matchers } from './matchers';

type NormalizedMatchers = {
	[K in keyof Matchers]: Parameters<Matchers[K]>['length'] extends 1
		? () => void
		: (expected: Parameters<Matchers[K]>[1]) => void;
};

export function expect(value: any): NormalizedMatchers {
	const _matchers = Object.entries(matchers).map(([name, matcher]) => {
		return [
			name,
			(expected: any) => {
				matcher(value, expected);
			},
		] as const;
	});

	return Object.fromEntries(_matchers) as never;
}

export class AssertionError extends Error {}
