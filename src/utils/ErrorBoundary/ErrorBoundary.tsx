import React, { ErrorInfo } from 'react';
import { IErrorBoundaryProps, IErrorBoundaryState } from './types';

export default class ErrorBoundary extends React.Component<
  IErrorBoundaryProps,
  IErrorBoundaryState
> {
  public state: IErrorBoundaryState = {
    hasError: false,
    error: undefined,
  };

  public componentDidCatch(err: Error, errInfo: ErrorInfo) {
    this.setState({
      hasError: true,
      error: err,
    });
  }

  public render() {
    const Component = this.props.fallback;
    if (this.state.hasError) {
      return <Component error={this.state.error} />;
    } else {
      return this.props.children;
    }
  }
}
