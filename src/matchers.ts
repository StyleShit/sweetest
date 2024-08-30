import { AssertionError } from './expect';

export type Matchers = {
	toBe: (value: unknown, expected: unknown) => void;
	toBeOne: (value: unknown) => void;
};

export type Matcher = (value: unknown, expected?: unknown) => void;

export const matchers = {
	toBe: (value, expected) => {
		if (value !== expected) {
			throw new AssertionError(
				`Expected \`${String(value)}\` to be \`${String(expected)}\``,
			);
		}
	},

	toBeOne: (value) => {
		if (value !== 1) {
			throw new AssertionError(`Expected \`${String(value)}\` to be 1`);
		}
	},
} satisfies Matchers;
