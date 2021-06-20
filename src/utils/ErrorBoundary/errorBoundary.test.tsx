import { render } from '@testing-library/react';
import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import { IErrorFallbackProps } from './types';

const FALLBACK_ID = 'error-fallback';
const TEST_ERROR = 'Error: Could not mount';
const NON_ERROR_CONTENT = 'Page content';

const ErrorFallbackExample = ({
  error,
}: IErrorFallbackProps): React.ReactElement => {
  return <div data-testid={FALLBACK_ID}>{error.message}</div>;
};

const ProblemComponent = ({
  shouldThrow = false,
}: {
  shouldThrow?: boolean;
}) => {
  if (shouldThrow) throw new Error(TEST_ERROR);
  return <div>{NON_ERROR_CONTENT}</div>;
};

describe('<ErrorBoundary />', () => {
  afterAll(() => {
    const spy = jest.spyOn(console, 'error');
    spy.mockRestore();
  });
  it('renders children when no errors are thrown', () => {
    const { queryByText } = render(
      <ErrorBoundary fallback={ErrorFallbackExample}>
        <ProblemComponent />
      </ErrorBoundary>
    );

    expect(queryByText(NON_ERROR_CONTENT)).toBeTruthy();
    expect(queryByText(TEST_ERROR)).toBeFalsy();
  });

  it('renders the fallback when an error is thrown', () => {
    // Mock console.error temporarily to keep our console clean
    const spy = jest.spyOn(console, 'error');
    spy.mockImplementation(() => {});

    const { queryByText } = render(
      <ErrorBoundary fallback={ErrorFallbackExample}>
        <ProblemComponent shouldThrow />
      </ErrorBoundary>
    );

    expect(queryByText(NON_ERROR_CONTENT)).toBeFalsy();
    expect(queryByText(TEST_ERROR)).toBeTruthy();
  });
});
