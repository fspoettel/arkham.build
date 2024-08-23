import { useCallback, useState } from "react";

type Options<T> = {
  defaultState?: T | undefined;
  onChange?: (val: T) => void;
  state?: T | undefined;
};

type SetStateFn<T> = (prevState?: T) => T;

export function useControllableState<T>(options: Options<T>) {
  const { defaultState, onChange, state } = options;

  const [uncontrolledState, setUncontrolledState] = useState<T | undefined>(
    defaultState,
  );

  const isControlled = typeof state !== "undefined";
  const value = isControlled ? state : uncontrolledState;

  const setValue: React.Dispatch<React.SetStateAction<T | undefined>> =
    useCallback(
      (next) => {
        const setter = next as SetStateFn<T>;
        const nextValue = typeof next === "function" ? setter(value) : next;

        if (isControlled) {
          onChange?.(nextValue as T);
        } else {
          setUncontrolledState(nextValue);
          onChange?.(next as T);
        }
      },
      [isControlled, onChange, value],
    );

  return [value, setValue] as const;
}
