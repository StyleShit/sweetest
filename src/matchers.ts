import { AssertionError } from './expect';

// Export an interface for external augmentations.
export interface Matchers extends Record<string, Matcher> {
	toBe: (value: unknown, expected: unknown) => void;
	toBeNull: (value: unknown) => void;
}

export type Matcher = (value: unknown, expected?: unknown) => void;

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
} satisfies Matchers;

export function addMatcher(name: string, matcher: Matcher) {
	matchers[name as keyof typeof matchers] = matcher;
}
