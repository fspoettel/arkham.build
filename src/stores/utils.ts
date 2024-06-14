import { DependencyList, useEffect, useState } from "react";
import { Row } from "tinybase";
import { Persister } from "tinybase/persisters/with-schemas";
import { createRelationships } from "tinybase/relationships/with-schemas";
import {
  OptionalSchemas,
  Store,
  Tables,
  TablesSchema,
  ValuesSchema,
  createStore,
} from "tinybase/store/with-schemas";
import { CellIdFromSchema } from "tinybase/internal/store/with-schemas";

/**
 * Generic type that turns a tinybase schema into a schema for values in that schema.
 */
export type SchemaType<S extends Schema> = {
  [K in keyof S]: TypeMap[S[K]["type"]];
};

type Schema = {
  [K: string]: { type: keyof TypeMap };
};

type TypeMap = {
  string: string;
  number: number;
  boolean: boolean;
};

/**
 * Generic type to remove readonly assignments.
 */
export type Writeable<T> = { -readonly [P in keyof T]: T[P] };

/**
 * Transform an array of arkhamdb-json-data into an index { [code]: data }.
 */
export function indexedByCode(
  arr: ({ code: string } & Row)[],
): Record<string, Row> {
  return arr.reduce(
    (acc, curr) => {
      acc[curr.code] = curr;
      return acc;
    },
    {} as Record<string, Row>,
  );
}

interface Destroyable {
  destroy(): void;
}

/**
 * Create a tinybase store with a table schema.
 * @see https://tinybase.org/guides/schemas-and-persistence/schema-based-typing/#getting-the-typed-store
 */
export function createStoreWithSchema<
  T extends TablesSchema,
  V extends ValuesSchema,
>(schema: T, valuesSchema: V) {
  return createStore().setTablesSchema(schema).setValuesSchema(valuesSchema);
}

/**
 * Load data from IndexedDB when starting up.
 * @see https://tinybase.org/guides/relationships-and-checkpoints/building-a-ui-with-relationships/
 */
export async function initializePersister<T extends OptionalSchemas>(
  persister: Persister<T> | undefined,
  initialState?: Tables<T[0]>,
) {
  if (persister) {
    console.debug("loading data from persistence layer.");
    await persister.startAutoLoad(initialState);
    console.debug("enabling persistence.");
    await persister.startAutoSave();
    console.debug("finished setting up persistence.");
  }
}

/**
 * Creates relationships for a tinybase store.
 * @see https://tinybase.org/guides/relationships-and-checkpoints/building-a-ui-with-relationships/
 */
export function createRelationshipsWithSchema<
  T extends OptionalSchemas,
  S extends string,
>(
  store: Store<T>,
  relationshipDefinitions: {
    relationshipId: string;
    localTableId: S;
    remoteTableId: string;
    getRemoteRowId: CellIdFromSchema<T[0], S>;
  }[],
) {
  const relationships = createRelationships(store);

  relationshipDefinitions.forEach(
    ({ relationshipId, localTableId, remoteTableId, getRemoteRowId }) => {
      relationships.setRelationshipDefinition(
        relationshipId,
        localTableId,
        remoteTableId,
        getRemoteRowId,
      );
    },
  );

  return relationships;
}

/**
 * Workaround for `useCreate` hooks not working under strict mode.
 * @see https://github.com/tinyplex/tinybase/issues/124
 */
export function useCreate<S extends OptionalSchemas, T extends Destroyable>(
  store: Store<S>,
  create: (store: Store<S>) => T,
  deps: DependencyList = [],
) {
  const [thing, setThing] = useState<T | undefined>(undefined);

  useEffect(() => {
    if (!thing) {
      setThing(create(store));
    }

    return () => {
      if (thing) {
        thing.destroy();
        setThing(undefined);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [store, thing, ...deps]);

  return thing;
}

/**
 * Creates an IndexedDB database to be used by tinybase.
 * Workaround for an issue where the native database create slows down the initial load.
 * @see https://github.com/tinyplex/tinybase/issues/123
 */
export function ensureDatabase(name: string) {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(name, 2);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request.onerror = (event: any) => {
      const error =
        event.target && event.target.error
          ? event.target.error
          : "unknown error";
      return reject(`Database error: ${error}`);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request.onsuccess = (event: any) => {
      const result: IDBDatabase = event.target.result;
      return resolve(result);
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    request.onupgradeneeded = (event: any) => {
      const db: IDBDatabase = event.target.result;
      db.createObjectStore("t", { keyPath: "k" });
      db.createObjectStore("v", { keyPath: "k" });
      resolve(db);
    };
  });
}
