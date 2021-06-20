import { ComponentType } from "react";

export interface IErrorBoundaryProps {
  fallback: ComponentType<IErrorFallbackProps>;
}

export type IErrorBoundaryState =
  | {
      hasError: false;
      error: undefined;
    }
  | {
      hasError: true;
      error: Error;
    };

export interface IErrorFallbackProps {
  error: Error;
}
