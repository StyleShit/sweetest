import { createContext } from './context';
import { AssertionError } from './expect';
import { createQueue, type Queue } from './queue';
import { createOutput, type Output } from './output';
import { createHooksRegistry, type HooksRegistry } from './hooks';

type Context = {
	name: string;
	failed: boolean;
	depth: number;
	queue: Queue;
	output: Output;
	hooks: HooksRegistry;
};

export const TestContext = createContext<Context | null>(null);

export function describe(name: string, cb: () => void) {
	const parentContext = TestContext.use();

	const context: Context = {
		name,
		failed: false,
		queue: createQueue(),
		output: createOutput(),
		hooks: createHooksRegistry(),
		depth: parentContext ? parentContext.depth + 1 : 0,
	};

	TestContext.provide(context, cb);

	if (parentContext) {
		parentContext.queue.enqueueSuite(name, runSuite);
	} else {
		runSuite();
	}

	function runSuite() {
		context.hooks.run('beforeAll');

		context.queue.forEach(({ type, name, cb }) => {
			switch (type) {
				case 'suite':
					cb();
					break;

				case 'test':
					runTest(name, cb);
					break;
			}
		});

		context.hooks.run('afterAll');

		printOutput();
	}

	function runTest(name: string, cb: () => void) {
		parentContext?.hooks.run('beforeEach');
		context.hooks.run('beforeEach');

		const indent = '\t'.repeat(context.depth + 1);

		try {
			cb();
			context.output.push(`${indent}✅ ${name}`);
		} catch (error: unknown) {
			if (!(error instanceof AssertionError)) {
				throw error;
			}

			context.failed = true;

			context.output.push(`${indent}❌ ${name}`);
			context.output.push(`${indent}\t ${error.message}`);
		}

		context.hooks.run('afterEach');
		parentContext?.hooks.run('afterEach');
	}

	function printOutput() {
		const indent = '\t'.repeat(context.depth);
		const prefix = context.failed ? '❌' : '✅';

		context.output.unshift(`${indent}${prefix} ${name}`);

		const suiteOutput = context.output.toString();

		if (parentContext) {
			parentContext.failed = parentContext.failed || context.failed;
			parentContext.output.push(suiteOutput);
		} else {
			console.log(suiteOutput);
		}
	}
}
