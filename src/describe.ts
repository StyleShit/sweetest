import { createContext } from './context';

type Context = {
	name: string;
	depth: number;
	addOutput: (output: string) => void;
	setFailed: () => void;
};

export const testContext = createContext<Context | null>(null);

export function describe(name: string, cb: () => void) {
	const parentContext = testContext.use();

	const output: string[] = [];

	// See: https://typescript-eslint.io/rules/no-unnecessary-condition/#when-not-to-use-it
	let failed = false as boolean;

	const context: Context = {
		name,
		depth: parentContext ? parentContext.depth + 1 : 0,
		addOutput: (line) => {
			output.push(line);
		},
		setFailed: () => {
			failed = true;
		},
	};

	testContext.provide(context, cb);

	const indent = '\t'.repeat(context.depth);
	const prefix = failed ? '❌' : '✅';

	const title = `${indent}${prefix} ${context.name}`;
	output.unshift(title);

	const outputString = output.join('\n');

	if (parentContext) {
		parentContext.addOutput(outputString);
	} else {
		console.log(outputString);
	}
}
