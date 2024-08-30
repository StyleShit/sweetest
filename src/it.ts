import { testContext } from './describe';
import { AssertionError } from './expect';

export function it(name: string, cb: () => void) {
	const context = testContext.use();

	if (!context) {
		throw new Error('it() must be called within a describe() block');
	}

	const indent = '\t'.repeat(context.depth);

	try {
		cb();
		context.addOutput(`${indent}\t✅ ${name}`);
	} catch (error: unknown) {
		if (error instanceof AssertionError) {
			context.setFailed();
			context.addOutput(`${indent}\t❌ ${name}`);
			context.addOutput(`${indent}\t\t ${error.message}`);
		} else {
			throw error;
		}
	}
}
