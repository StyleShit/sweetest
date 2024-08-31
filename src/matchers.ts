import { AssertionError } from './expect';
import type { MockFn } from './fn';

// Export an interface for external augmentations.
export interface Matchers extends Record<string, Matcher> {
	toBe: (value: unknown, expected: unknown) => void;
	toBeNull: (value: unknown) => void;
	toHaveBeenCalled: (value: MockFn) => void;
	toHaveBeenCalledTimes: (value: MockFn, expected: number) => void;
}

export type Matcher = (value: any, expected?: any) => void;

export const matchers = {
	toBe: (value, expected) => {
		if (value !== expected) {
			throw new AssertionError(
				`Expected \`${String(value)}\` to be \`${String(expected)}\``,
			);
		}
	},

	toBeNull: (value) => {
		if (value !== null) {
			throw new AssertionError(
				`Expected \`${String(value)}\` to be \`null\``,
			);
		}
	},

	toHaveBeenCalled: (value) => {
		if (value.calls.length === 0) {
			throw new AssertionError(`Expected mock function to be called`);
		}
	},

	toHaveBeenCalledTimes: (value, expected) => {
		const calls = value.calls.length;

		if (calls !== expected) {
			const times = expected === 1 ? 'once' : `${String(expected)} times`;
			const called = calls === 1 ? 'once' : `${String(calls)} times`;

			throw new AssertionError(
				`Expected mock function to be called ${times}, but it was called ${called}`,
			);
		}
	},
} satisfies Matchers;

export function addMatcher(name: string, matcher: Matcher) {
	matchers[name as keyof typeof matchers] = matcher;
}
