import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import * as sweetest from '..';

describe('Sweetest', () => {
	beforeAll(() => {
		vi.useFakeTimers();
	});

	afterAll(() => {
		vi.useRealTimers();
	});

	it('should print the `describe` and `it` names and statuses properly', () => {
		// Arrange.
		const consoleSpy = vi
			.spyOn(console, 'log')
			.mockImplementation(() => {});

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

		vi.runAllTimers();

		// Assert.
		const loggedLines = consoleSpy.mock.calls.map(
			(args) => args[0] as string,
		);

		expect(loggedLines.join('\n')).toMatchSnapshot();
	});

	it('should throw an error when `it` is called outside of `describe`', () => {
		// Arrange.
		const consoleSpy = vi
			.spyOn(console, 'log')
			.mockImplementation(() => {});

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

	it('should show a warning sign when some of the tests in a suite have failed', () => {
		// Arrange.
		const consoleSpy = vi
			.spyOn(console, 'log')
			.mockImplementation(() => {});

		// Act.
		sweetest.describe('Test Suite', () => {
			sweetest.it('Test Case 1', () => {
				sweetest.expect(1).toBe(2);
			});

			sweetest.it('Test Case 2', () => {
				sweetest.expect(1).toBeOne();
			});
		});

		vi.runAllTimers();

		// Assert.
		const loggedLines = consoleSpy.mock.calls.map(
			(args) => args[0] as string,
		);

		expect(loggedLines.join('\n')).toMatchSnapshot();
	});

	it('should show an error sign when all of the tests in a suite have failed', () => {
		// Arrange.
		const consoleSpy = vi
			.spyOn(console, 'log')
			.mockImplementation(() => {});

		// Act.
		sweetest.describe('Test Suite', () => {
			sweetest.it('Test Case 1', () => {
				sweetest.expect(1).toBe(2);
			});

			sweetest.it('Test Case 2', () => {
				sweetest.expect(1).toBe(3);
			});
		});

		vi.runAllTimers();

		// Assert.
		const loggedLines = consoleSpy.mock.calls.map(
			(args) => args[0] as string,
		);

		expect(loggedLines.join('\n')).toMatchSnapshot();
	});
});
