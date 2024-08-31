export { describe } from './describe';
export { it } from './it';
export { expect, AssertionError } from './expect';
export { addMatcher, type Matcher, type Matchers } from './matchers';
export { beforeAll, beforeEach, afterAll, afterEach } from './hooks';

import { fn } from './fn';

export const sw = {
	fn,
};
