# Sweetest

Simple testing framework inspired by Jest.

This is not a fully functional testing framework, it's just a simple example of how you can create your own testing framework.
Why would you do that? Because it's fun, duh!

## Usage

Well, it's very similar to Jest, you have the same `describe`, `it` and `expect` functions, just with (much) less features:

```TS
import { describe, it, expect } from 'sweetest';

describe('My test suite', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2);
  });

  it('should fail', () => {
    expect(1 + 1).toBe(3);
  });

  describe('Nested suite', () => {
    it('should pass', () => {
      expect(null).toBeNull();
    });
  });
});
```

The output will be something like this:

```
❌ My test suite
	✅ should pass
    ❌ should fail
    ✅ Nested suite
        ✅ should pass
```

## Matchers

Currently, there is a limited list of built in matchers:

- `toBe(value)`: Strict equality with `value`
- `toBeNull()`: Strict equality with `null`

But, you can still create your own matchers, just like in Jest.
A "matcher" is a function that receives the value to be tested along with the expected value, and throws an `AssertionError` if the value is not as expected:

```TS
import { addMatcher, AssertionError, type Matcher } from 'sweetest';

const toBeGreaterThan: Matcher = (value: number, expected: number) => {
  if (value <= expected) {
    throw new AssertionError(`Expected ${value} to be greater than ${expected}`);
  }
};

addMatcher('toBeGreaterThan', toBeGreaterThan);
```

If you're using TypeScript, you'll also need to extend the `Matchers` interface using "[Module Augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)":

```TS
declare module 'sweetest' {
  interface Matchers {
    toBeGreaterThan(value: number, expected: number): void;
  }
}
```

## Hooks

Same as in Jest, you can use hooks to run code before and after each test, or before and after each suite:

```TS
import { describe, it, beforeEach, afterEach, beforeAll, afterAll } from 'sweetest';

describe('My test suite', () => {
  beforeAll(() => {
    console.log('Before all tests');
  });

  beforeEach(() => {
    console.log('Before each test');
  });

  afterEach(() => {
    console.log('After each test');
  });

  afterAll(() => {
    console.log('After all tests');
  });

  it('should pass', () => {
    expect(1 + 1).toBe(2);
  });
});
```
