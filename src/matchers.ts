import { AssertionError } from './expect';
import type { MockFn } from './fn';

// Export an interface for external augmentations.
export interface Matchers extends Record<string, Matcher> {
	toBe: (value: unknown, expected: unknown) => void;
	toBeNull: (value: unknown) => void;
	toHaveBeenCalled: (value: MockFn) => void;
	toHaveBeenCalledTimes: (value: MockFn, expected: number) => void;
	toHaveBeenCalledWith: (value: MockFn, expected: any[]) => void;
}

export type Matcher = (value: any, expected?: any) => void;

export const matchers: Matchers = {
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

	toHaveBeenCalledWith: (value, expected) => {
		const calls = value.calls;

		const hasBeenCalledWith = calls.some((call) => {
			if (call.length !== expected.length) {
				return false;
			}

			return call.every((arg, index) => arg === expected[index]);
		});

		if (!hasBeenCalledWith) {
			throw new AssertionError(
				`Expected mock function to be called with ${expected.join(', ')}`,
			);
		}
	},
};

export function addMatcher(name: string, matcher: Matcher) {
	matchers[name as keyof typeof matchers] = matcher;
}
