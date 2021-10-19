import { useCallback, useState } from "react";

export default function useAsync<FunctionReturn, Params extends unknown[]>({
  asyncFunction,
  onSuccess,
  onError,
}: {
  asyncFunction: (...params: Params) => Promise<FunctionReturn>;
  onSuccess?: (newValue: FunctionReturn) => void | Promise<void>;
  onError?: (
    err: unknown
  ) => void | ErrorWithBody | Promise<void | ErrorWithBody>;
}): [
  execute: (...params: Params) => Promise<void>,
  loading: boolean,
  response: FunctionReturn | undefined,
  error: ErrorWithBody | undefined
] {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<FunctionReturn>();
  const [errorState, setErrorState] = useState<ErrorWithBody>();

  const execute = useCallback(
    async (...params: Params) => {
      try {
        setLoading(true);
        const response = await asyncFunction(...params);
        await onSuccess?.(response);
        setValue(response);
      } catch (error) {
        const onErrResponse = await onError?.(error);
        setErrorState(onErrResponse ?? error);
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction]
  );

  return [execute, loading, value, errorState];
}

type ErrorWithBody = Error & { body?: Record<string, unknown> };
