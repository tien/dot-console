import { useCallback, useEffect, useRef } from "react";

export function useStateRef<T>(value: T, listener: (state: T) => void) {
  const ref = useRef(value);

  useEffect(() => {
    listener(ref.current);
  }, [listener]);

  return useCallback(
    (value: React.SetStateAction<T>) => {
      ref.current = value instanceof Function ? value(ref.current) : value;
      listener(ref.current);
    },
    [listener],
  );
}
