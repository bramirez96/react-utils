import { render } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import useLocalStorage from './useLocalStorage';

function setup(param: Parameters<typeof useLocalStorage>[0]) {
  const returnVal = {};
  function TestComponent() {
    Object.assign(returnVal, useLocalStorage(param));
    return null;
  }
  render(<TestComponent />);
  return returnVal as ReturnType<typeof useLocalStorage>;
}

// Initialize localStorage key to test with
const STORAGE_KEY = 'testLocalStorage';

describe('useLocalStorage', () => {
  // Clear localStorage between tests
  beforeEach(() => {
    localStorage.clear();
  });
  afterAll(() => {
    localStorage.clear();
  });

  it('returns a correct array', () => {
    const returnObj = setup({
      key: STORAGE_KEY,
    });

    // Expect an array with length 3
    expect(Object.keys(returnObj)).toHaveLength(4);
    // Expect value to be undefined
    expect(returnObj[0]).toBeUndefined();
    // Setter should be a function
    expect(returnObj[1]).toBeInstanceOf(Function);
    // Clear should be a function
    expect(returnObj[2]).toBeInstanceOf(Function);
    // Fourth item should be a boolean
    expect([true, false]).toContain(returnObj[3]);
  });

  it('should correctly initialize defaultValue', () => {
    // Initialize string value to test state
    const TEST_VAL = 'someString';

    const returnObj = setup({
      key: STORAGE_KEY,
      defaultValue: TEST_VAL,
    });

    // Expect an array with length 3
    expect(Object.keys(returnObj)).toHaveLength(4);
    // Expect value to be initialized correctly
    expect(returnObj[0]).toBe(TEST_VAL);
    // Expect localStorage to have been set correctly
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) as string)).toBe(
      TEST_VAL
    );
  });

  it('should update localStorage when setter is called', () => {
    // Initialize string value to test state
    const TEST_VAL = 'someString';

    const returnObj = setup({
      key: STORAGE_KEY,
    });

    // Expect an array with length 3
    expect(Object.keys(returnObj)).toHaveLength(4);
    // Expect value to be undefined
    expect(returnObj[0]).toBeUndefined();

    // Pass a string into the setter
    act(() => returnObj[1](TEST_VAL));
    // Expect the value to have updated
    expect(returnObj[0]).toBe(TEST_VAL);
    // Expect localStorage to have been set correctly
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) as string)).toBe(
      TEST_VAL
    );

    // Pass undefined into the setter
    act(() => returnObj[1](undefined));
    // Expect the value to have updated
    expect(returnObj[0]).toBeUndefined();
    // Expect localStorage to have been cleared correctly
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) as string)).toBeNull();
  });

  it('should successfully clear the value from storage', () => {
    // Initialize string value to test state
    const TEST_VAL = 'someString';

    const returnObj = setup({
      key: STORAGE_KEY,
    });

    // Expect an array with length 3
    expect(Object.keys(returnObj)).toHaveLength(4);
    // Expect value to be undefined
    expect(returnObj[0]).toBeUndefined();

    // Pass a string into the setter
    act(() => returnObj[1](TEST_VAL));
    // Expect the value to have updated
    expect(returnObj[0]).toBe(TEST_VAL);
    // Expect localStorage to have been set correctly
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) as string)).toBe(
      TEST_VAL
    );

    // Run the clear function instead of the setter
    act(() => returnObj[2]());
    // Expect the value to have updated
    expect(returnObj[0]).toBeUndefined();
    // Expect localStorage to have been cleared correctly
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY) as string)).toBeNull();
  });

  it('should initialize value when localStorage is already set', () => {
    // Initialize string value to test state
    const TEST_VAL = 'someString';
    // Initialize localStorage value before running hook
    localStorage.setItem(STORAGE_KEY, JSON.stringify(TEST_VAL));

    const returnObj = setup({
      key: STORAGE_KEY,
    });

    // Expect an array with length 3
    expect(Object.keys(returnObj)).toHaveLength(4);
    // Expect value to be undefined
    expect(returnObj[0]).toBe(TEST_VAL);
  });
});
