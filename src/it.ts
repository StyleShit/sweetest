import { testContext } from './describe';
import { AssertionError } from './expect';

export function it(name: string, cb: () => void) {
	const context = testContext.use();

	if (!context) {
		throw new Error('it() must be called within a describe() block');
	}

	try {
		cb();
		context.addSuccessfulTest(name);
	} catch (error: unknown) {
		if (error instanceof AssertionError) {
			context.addFailedTest(name, error);
		} else {
			throw error;
		}
	}
}
