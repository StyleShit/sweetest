import { TestContext } from './describe';

export function it(name: string, cb: () => void) {
	const context = TestContext.use();

	if (!context) {
		throw new Error('it() must be called within a describe() block');
	}

	context.queue.enqueueTest(name, cb);
}
