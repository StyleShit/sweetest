export type Queue = {
	enqueueTest: (name: string, cb: () => void) => void;
	enqueueSuite: (name: string, cb: () => void) => void;
	forEach: (cb: (item: QueueItem) => void) => void;
};

export type QueueItem = {
	type: 'test' | 'suite';
	name: string;
	cb: () => void;
};

export function createQueue(): Queue {
	const items: QueueItem[] = [];

	return {
		enqueueTest: (name, cb) => {
			items.push({ type: 'test', name, cb });
		},
		enqueueSuite: (name, cb) => {
			items.push({ type: 'suite', name, cb });
		},
		forEach: (cb) => {
			items.forEach(cb);
		},
	};
}
