import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

const useLocalStorage = <ValueType>({
  key,
  defaultValue,
}: {
  key: string;
  defaultValue?: ValueType;
}): [
  value: ValueType | undefined,
  set: Dispatch<SetStateAction<ValueType | undefined>>,
  clear: () => void,
  loading: boolean
] => {
  const [value, setValue] = useState(defaultValue);
  const [loading, setLoading] = useState(true);

  const clear = useCallback(() => {
    setValue(undefined);
    localStorage.removeItem(key);
  }, [key, setValue]);

  useEffect(() => {
    const valueFromLocalStorage = localStorage.getItem(key);
    if (valueFromLocalStorage) {
      setValue(JSON.parse(valueFromLocalStorage));
    } else if (defaultValue) {
      localStorage.setItem(key, JSON.stringify(defaultValue));
    }
    setLoading(false);
  }, [key]);

  useEffect(() => {
    if (value) {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.removeItem(key);
    }
  }, [value]);

  return [value, setValue, clear, loading];
};

export default useLocalStorage;
