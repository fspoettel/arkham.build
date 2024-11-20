import { useCallback, useEffect, useReducer, useRef } from "react";

type StateLoading = {
  error: undefined;
  data: undefined;
  loading: true;
};

type StateSuccess<T> = {
  error: undefined;
  data: T;
  loading: false;
};

type StateError = {
  error: unknown;
  data: undefined;
  loading: false;
};

type State<T> = StateLoading | StateError | StateSuccess<T>;

type Action<T> =
  | { type: "LOADING" }
  | { type: "SUCCESS"; payload: T }
  | { type: "ERROR"; payload: unknown }
  | { type: "RESET" };

function reducer<T>(_: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case "LOADING":
      return { error: undefined, data: undefined, loading: true };
    case "SUCCESS":
      return { error: undefined, loading: false, data: action.payload };
    case "ERROR":
      return { data: undefined, loading: false, error: action.payload };
    case "RESET":
      return { error: undefined, data: undefined, loading: false };
  }
}

type Query<T> = () => Promise<T>;

export function useQuery<T>(query: Query<T> | undefined): State<T> {
  const [state, dispatch] = useReducer(reducer<T>, {
    loading: false,
    error: undefined,
    data: undefined,
  } as State<T>);

  const lock = useRef(false);

  const doQuery = useCallback(async () => {
    if (!query) {
      dispatch({ type: "RESET" });
    }

    if (!lock.current && query) {
      lock.current = true;
      dispatch({ type: "LOADING" });

      try {
        const data = await query();
        dispatch({ type: "SUCCESS", payload: data });
      } catch (err) {
        dispatch({ type: "ERROR", payload: err });
      } finally {
        lock.current = false;
      }
    }
  }, [query]);

  useEffect(() => {
    doQuery();
  }, [doQuery]);

  return state;
}

export function useMutate<T>(query: Query<T>): State<T> & {
  mutate: () => Promise<void>;
} {
  const [state, dispatch] = useReducer(reducer<T>, {
    loading: false,
    error: undefined,
    data: undefined,
  } as State<T>);

  const mutate = useCallback(async () => {
    dispatch({ type: "LOADING" });
    try {
      const data = await query();
      dispatch({ type: "SUCCESS", payload: data });
    } catch (err) {
      dispatch({ type: "ERROR", payload: err });
      throw err;
    }
  }, [query]);

  return {
    ...state,
    mutate,
  };
}
