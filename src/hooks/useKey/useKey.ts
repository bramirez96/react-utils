import { useCallback, useEffect } from "react";
import { IUseKeyProps } from "./useKeyTypes";

function useKey<CodeType extends "code" | "key" = "key">(
  args: IUseKeyProps<CodeType>
): void;
function useKey({
  key,
  action,
  codeType = "key",
  keyFunction = "keydown",
}: IUseKeyProps<"code" | "key">): void {
  const executeActionOnKey = useCallback(
    (event: KeyboardEvent) => {
      const code = event[codeType];
      if (code === key) action();
    },
    [key, action, codeType]
  );

  useEffect(() => {
    document.addEventListener(keyFunction, executeActionOnKey);
    return () => document.removeEventListener(keyFunction, executeActionOnKey);
  }, [executeActionOnKey, keyFunction]);
}

export default useKey;
