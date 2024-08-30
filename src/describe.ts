import { createContext } from './context';
import type { AssertionError } from './expect';

type Context = {
	name: string;
	depth: number;
	addSuccessfulTest: (name: string) => void;
	addFailedTest: (name: string, error: Error) => void;
};

export const testContext = createContext<Context | null>(null);

export function describe(name: string, cb: () => void) {
	const parentContext = testContext.use();

	const successfulTests: string[] = [];
	const failedTests: [string, AssertionError][] = [];

	const context: Context = {
		name,
		depth: parentContext ? parentContext.depth + 1 : 0,
		addSuccessfulTest: (name) => successfulTests.push(name),
		addFailedTest: (name, error) => failedTests.push([name, error]),
	};

	testContext.provide(context, cb);

	const print = () => {
		const indent = '\t'.repeat(context.depth);

		const getPrefix = () => {
			if (failedTests.length === 0) {
				return '🟢';
			}

			if (successfulTests.length === 0) {
				return '🔴';
			}

			return '🟠';
		};

		const title = `${indent}${getPrefix()} ${context.name}`;

		console.log(title);

		for (const name of successfulTests) {
			console.log(`${indent}\t✅ ${name}`);
		}

		for (const [name, error] of failedTests) {
			console.log(`${indent}\t❌ ${name}`);
			console.log(`${indent}\t\t${error.message}`);
		}
	};

	// Print nested `describe`s after their parent `describe`.
	// TODO: Find a better solution.
	if (context.depth === 0) {
		print();
	} else {
		setTimeout(print, 0);
	}
}
