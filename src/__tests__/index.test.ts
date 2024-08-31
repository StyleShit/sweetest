import { describe, expect, it, vi } from 'vitest';
import * as sweetest from '..';

describe('Sweetest', () => {
	it('should print the `describe` and `it` names and statuses in order', () => {
		// Arrange.
		const { getOutput } = mockConsole();

		// Act.
		sweetest.describe('Test Suite', () => {
			sweetest.it('Test Case 1', () => {
				console.log('Inside test case 1');
			});

			sweetest.it('Test Case 2', () => {
				console.log('Inside test case 2');
			});

			sweetest.describe('Inner Test Suite', () => {
				sweetest.it('Test Case 3', () => {
					console.log('Inside test case 3');
				});

				sweetest.it('Test Case 4', () => {
					console.log('Inside test case 4');
				});
			});
		});

		// Assert.
		expect(getOutput()).toMatchSnapshot();
	});

	it('should throw an error when `it` is called outside of `describe`', () => {
		// Arrange.
		const { consoleSpy } = mockConsole();

		// Act.
		const test = () => {
			sweetest.it('Test Case', () => {
				console.log('Inside test case');
			});
		};

		// Assert.
		expect(consoleSpy).not.toHaveBeenCalled();

		expect(test).toThrow(
			new Error('it() must be called within a describe() block'),
		);
	});

	it('should show an error indication when some of the tests in a suite have failed', () => {
		// Arrange.
		const { getOutput } = mockConsole();

		// Act.
		sweetest.describe('Test Suite', () => {
			sweetest.it('Test Case 1', () => {
				sweetest.expect(1).toBe(2);
			});

			sweetest.it('Test Case 2', () => {
				sweetest.expect(null).toBeNull();
			});
		});

		// Assert.
		expect(getOutput()).toMatchSnapshot();
	});

	it('should show an error indication when all of the tests in a suite have failed', () => {
		// Arrange.
		const { getOutput } = mockConsole();

		// Act.
		sweetest.describe('Test Suite', () => {
			sweetest.it('Test Case 1', () => {
				sweetest.expect(1).toBe(2);
			});

			sweetest.it('Test Case 2', () => {
				sweetest.expect(1).toBe(3);
			});
		});

		// Assert.
		expect(getOutput()).toMatchSnapshot();
	});

	it('should show an error indication when an inner suite have failed', () => {
		// Arrange.
		const { getOutput } = mockConsole();

		// Act.
		sweetest.describe('Test Suite', () => {
			sweetest.it('Test Case 1', () => {
				sweetest.expect(1).toBe(1);
			});

			sweetest.describe('Inner Test Suite', () => {
				sweetest.it('Test Case 2', () => {
					sweetest.expect(1).toBe(1);
				});

				sweetest.it('Test Case 3', () => {
					sweetest.expect(1).toBe(2);
				});
			});
		});

		// Assert.
		expect(getOutput()).toMatchSnapshot();
	});

	it('should rethrow errors that were thrown in the a case', () => {
		// Act & Assert.
		expect(() => {
			sweetest.describe('Test Suite', () => {
				sweetest.it('Test Case', () => {
					throw new Error('Test error');
				});
			});
		}).toThrow(new Error('Test error'));
	});

	it('should run lifecycle hooks in order', () => {
		// Arrange.
		const calls: string[] = [];

		// Act.
		sweetest.describe('Test Suite', () => {
			sweetest.beforeAll(() => {
				calls.push('beforeAll-outer');
			});

			sweetest.beforeEach(() => {
				calls.push('beforeEach-outer');
			});

			sweetest.afterEach(() => {
				calls.push('afterEach-outer');
			});

			sweetest.afterAll(() => {
				calls.push('afterAll-outer');
			});

			sweetest.it('Test Case 1', () => {
				calls.push('test-1-outer');
			});

			sweetest.it('Test Case 2', () => {
				calls.push('test-2-outer');
			});

			sweetest.describe('Inner Test Suite', () => {
				sweetest.beforeAll(() => {
					calls.push('beforeAll-inner');
				});

				sweetest.beforeEach(() => {
					calls.push('beforeEach-inner');
				});

				sweetest.afterEach(() => {
					calls.push('afterEach-inner');
				});

				sweetest.afterAll(() => {
					calls.push('afterAll-inner');
				});

				sweetest.it('Test Case 3', () => {
					calls.push('test-3-inner');
				});

				sweetest.it('Test Case 4', () => {
					calls.push('test-4-inner');
				});
			});
		});

		// Assert.
		expect(calls).toEqual([
			// Outer suite -- start
			'beforeAll-outer',

			// Test 1
			'beforeEach-outer',
			'test-1-outer',
			'afterEach-outer',

			// Test 2
			'beforeEach-outer',
			'test-2-outer',
			'afterEach-outer',

			// Inner suite -- start
			'beforeAll-inner',

			// Test 3
			'beforeEach-outer',
			'beforeEach-inner',
			'test-3-inner',
			'afterEach-inner',
			'afterEach-outer',

			// Test 4
			'beforeEach-outer',
			'beforeEach-inner',
			'test-4-inner',
			'afterEach-inner',
			'afterEach-outer',

			// Inner suite -- end
			'afterAll-inner',

			// Outer suite -- end
			'afterAll-outer',
		]);
	});

	it.each(['beforeAll', 'beforeEach', 'afterEach', 'afterAll'] as const)(
		'should throw an error when lifecycle hook `%s` is called outside of `describe`',
		(hook) => {
			expect(() => {
				sweetest[hook](() => {});
			}).toThrow(
				new Error(`${hook}() must be called within a describe() block`),
			);
		},
	);

	it.each(['beforeAll', 'beforeEach', 'afterEach', 'afterAll'] as const)(
		'should support only a single callback for lifecycle hook `%s`',
		(hook) => {
			// Arrange.
			const calls: string[] = [];

			// Act.
			sweetest.describe('Test Suite', () => {
				sweetest[hook](() => {
					calls.push('call-1');
				});

				sweetest[hook](() => {
					calls.push('call-2');
				});

				sweetest.it('Test Case', () => {});
			});

			// Assert.
			expect(calls).toEqual(['call-2']);
		},
	);

	it('should support custom matchers', () => {
		// Arrange.
		const toBeOne: sweetest.Matcher = (value) => {
			if (value !== 1) {
				throw new sweetest.AssertionError(
					`Expected \`${String(value)}\` to be \`1\``,
				);
			}
		};

		// Act.
		sweetest.addMatcher('toBeOne', toBeOne);

		type ExtendedMatchers = ReturnType<typeof sweetest.expect> & {
			toBeOne: () => void;
		};

		// Assert.
		expect(() => {
			(sweetest.expect(2) as ExtendedMatchers).toBeOne();
		}).toThrow(new sweetest.AssertionError('Expected `2` to be `1`'));
	});

	it('should support mock functions implementation', () => {
		// Arrange.
		const mockFn1 = sweetest.sw.fn();
		const mockFn2 = sweetest.sw.fn((count: number) => 41 + count);

		// Assert.
		expect(mockFn1()).toBeNull();
		expect(mockFn2(1)).toBe(42);
	});

	it('should support mock functions call assertions', () => {
		// Arrange.
		const { getOutput } = mockConsole();

		// Act.
		sweetest.describe('Test Suite', () => {
			sweetest.it('Should pass -- toHaveBeenCalled', () => {
				const mockFn = sweetest.sw.fn();

				mockFn();

				sweetest.expect(mockFn).toHaveBeenCalled();
			});

			sweetest.it('Should fail -- toHaveBeenCalled', () => {
				const mockFn = sweetest.sw.fn();

				sweetest.expect(mockFn).toHaveBeenCalled();
			});

			sweetest.it('Should pass -- toHaveBeenCalledTimes', () => {
				const mockFn = sweetest.sw.fn();

				mockFn();
				mockFn();

				sweetest.expect(mockFn).toHaveBeenCalledTimes(2);
			});

			sweetest.it('Should fail -- toHaveBeenCalledTimes', () => {
				const mockFn = sweetest.sw.fn();

				mockFn();

				sweetest.expect(mockFn).toHaveBeenCalledTimes(2);
			});

			sweetest.it('Should pass -- toHaveBeenCalledWith', () => {
				const mockFn = sweetest.sw.fn();

				mockFn(1, 2, 3);

				sweetest.expect(mockFn).toHaveBeenCalledWith([1, 2, 3]);
			});

			sweetest.it('Should fail -- toHaveBeenCalledWith', () => {
				const mockFn = sweetest.sw.fn();

				mockFn(null);

				sweetest.expect(mockFn).toHaveBeenCalledWith([1, 2, 3]);
			});
		});

		// Assert.
		expect(getOutput()).toMatchSnapshot();
	});
});

function mockConsole() {
	const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

	return {
		consoleSpy,
		getOutput: () =>
			consoleSpy.mock.calls.map((args) => String(args[0])).join('\n'),
	};
}
