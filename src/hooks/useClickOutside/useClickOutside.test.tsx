import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import useClickOutside from './useClickOutside';

function setup(param: Parameters<typeof useClickOutside>[0]) {
  const returnVal = {};
  function TestComponent() {
    const hookReturn = useClickOutside(param);
    Object.assign(returnVal, hookReturn);
    return <div ref={hookReturn[0]} />;
  }
  render(<TestComponent />);
  return returnVal as ReturnType<typeof useClickOutside>;
}

function setupWithNullRef(param: Parameters<typeof useClickOutside>[0]) {
  const returnVal = {};
  function TestComponent() {
    Object.assign(returnVal, useClickOutside(param));
    return null;
  }
  render(<TestComponent />);
  return returnVal as ReturnType<typeof useClickOutside>;
}

describe('useClickOutside', () => {
  it('returns a correct array', () => {
    const returnObj = setup({
      onClick: () => undefined,
    });
    // Make sure the hook returns only one object in the array
    expect(Object.keys(returnObj)).toHaveLength(1);
    // Make sure the returned object is a ref
    expect(returnObj[0]).toBeInstanceOf(Object);
    expect(returnObj[0]).toHaveProperty('current');
  });

  it('correctly adds the onClick trigger functionality', () => {
    // Initialize a spy to watch for the onClick
    const spy = jest.fn(() => null);
    const returnObj = setup({
      onClick: spy,
    });

    // Expect that the spy hasn't been called yet
    expect(spy).toHaveBeenCalledTimes(0);

    // Throw this error as it should never be thrown unless we break tests
    if (!returnObj[0].current)
      throw new Error('Error! Hook did not return a valid ref');
    // Click the element
    fireEvent.mouseDown(returnObj[0].current);
    // The spy should not have been called, as we're stopping propagation
    expect(spy).toHaveBeenCalledTimes(0);

    // Now we click the document, which should trigger the onClick
    fireEvent.mouseDown(document);
    // The spy should now have been called once
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('correctly disables the functionality when isActive is false', () => {
    // Initialize a spy to watch for the onClick
    const spy = jest.fn(() => null);
    setup({
      onClick: spy,
      isActive: false,
    });

    // Expect that the spy hasn't been called yet
    expect(spy).toHaveBeenCalledTimes(0);

    // Click the document
    fireEvent.mouseDown(document);
    // The spy should not have been called, as the effect is not active
    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('does nothing when encountering a null ref', () => {
    // Initialize a spy to watch for the onClick
    const spy = jest.fn(() => null);
    const returnObj = setupWithNullRef({
      onClick: spy,
      isActive: false,
    });

    // Expect that the spy hasn't been called yet
    expect(spy).toHaveBeenCalledTimes(0);

    // The ref should be null, so we can't try clicking it
    expect(returnObj[0].current).toBeNull();
    // And if we click the document, nothing should happen still
    fireEvent.mouseDown(document);
    // Expect that the spy still hasn't been called yet
    expect(spy).toHaveBeenCalledTimes(0);
  });
});
