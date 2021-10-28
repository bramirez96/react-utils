import { act, render } from '@testing-library/react';
import React, { useState } from 'react';
import useAsync from './useAsync';

function setup(param: Parameters<typeof useAsync>[0]) {
  const returnVal = {};
  function TestComponent() {
    Object.assign(returnVal, useAsync(param));
    return null;
  }
  render(<TestComponent />);
  return returnVal as ReturnType<typeof useAsync>;
}

function setupWithSetter(param: Parameters<typeof useAsync>[0]) {
  const returnVal = {};
  function TestComponent() {
    const [state, setState] = useState();
    // Passing in a setter is requiring some nuts typecasting in this particular use case
    Object.assign(
      returnVal,
      useAsync({
        ...param,
        onSuccess: setState as unknown as Parameters<
          typeof useAsync
        >[0]['onSuccess'],
      })
    );
    // Cast the state value as the returned state value from the hook
    Object.assign(returnVal, { 2: state });
    return null;
  }
  render(<TestComponent />);
  return returnVal as ReturnType<typeof useAsync>;
}

describe('useAsync', () => {
  it('returns a correct array', async () => {
    const returnObj = setup({
      run: async () => null,
    });

    // Expect a an array with length 4
    expect(Object.keys(returnObj)).toHaveLength(4);

    // Expect loading state to be false
    expect(returnObj[1]).toBe(false);
    // Expect the initial state value to be undefined
    expect(returnObj[2]).toBeUndefined();
    // Expect there to be no errors
    expect(returnObj[3]).toBeUndefined();

    // Execute the function
    const res = act(returnObj[0]);
    // It should be "Loading" while function is running
    expect(returnObj[1]).toBe(true);

    // Wait for the function to finish executing
    await res;

    // Expect the new state value to be null
    expect(returnObj[2]).toBe(null);
    // Expect there to be no errors
    expect(returnObj[3]).toBeUndefined();
  });

  it('correctly throws an error from the async callback', async () => {
    const ERROR_MSG = 'error message';
    const returnObj = setup({
      run: async () => {
        throw new Error(ERROR_MSG);
      },
    });

    // Expect a an array with length 4
    expect(Object.keys(returnObj)).toHaveLength(4);

    // Expect loading state to be false
    expect(returnObj[1]).toBe(false);
    // Expect the initial state value to be undefined
    expect(returnObj[2]).toBeUndefined();
    // Expect there to be no errors
    expect(returnObj[3]).toBeUndefined();

    // Execute the function
    const res = act(returnObj[0]);
    // It should be "Loading" while function is running
    expect(returnObj[1]).toBe(true);

    // Wait for the function to finish executing
    await res;

    // Expect the new state value to still be undefined
    expect(returnObj[2]).toBeUndefined();
    // Expect there to be an error
    expect(returnObj[3]?.message).toBe(ERROR_MSG);
  });

  it('correctly utilizes the custom state setter', async () => {
    // Initialize a spy for our onClick
    const spy = jest.fn(async () => Promise.resolve(true));
    const returnObj = setupWithSetter({
      run: spy,
    });

    // Sanity check to make sure we haven't called the spy yet
    expect(spy).toHaveBeenCalledTimes(0);

    // Expect a an array with length 4
    expect(Object.keys(returnObj)).toHaveLength(4);

    // Expect loading state to be false
    expect(returnObj[1]).toBe(false);
    // Expect the initial state value to be undefined
    expect(returnObj[2]).toBeUndefined();
    // Expect there to be no errors
    expect(returnObj[3]).toBeUndefined();

    // Execute the function
    const res = act(returnObj[0]);
    // It should be "Loading" while function is running
    expect(returnObj[1]).toBe(true);

    // Wait for the function to finish executing
    await res;
    // The function should now have been called
    expect(spy).toHaveBeenCalledTimes(1);

    // Expect the new state value to be true
    expect(returnObj[2]).toBe(true);
    // Expect there to be no errors
    expect(returnObj[3]).toBeUndefined();
  });
});
