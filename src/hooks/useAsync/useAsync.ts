import { useCallback, useState } from "react";

export default function useAsync<FunctionReturn, Params extends unknown[]>({
  run,
  onSuccess,
  onError,
}: {
  run: (...params: Params) => FunctionReturn | Promise<FunctionReturn>;
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

        // Run the function
        const response = await run(...params);
        setValue(response);
        setLoading(false);

        // Run onSuccess AFTER setting value and loading state
        await onSuccess?.(response);
      } catch (error) {
        const onErrResponse = await onError?.(error);
        setErrorState(onErrResponse ?? (error as ErrorWithBody));
        setLoading(false);
      }
    },
    [run, onError, onSuccess]
  );

  return [execute, loading, value, errorState];
}

type ErrorWithBody = Error & { body?: Record<string, unknown> };
