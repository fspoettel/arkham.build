import { DependencyList, useEffect, useState } from "react";
import { Row } from "tinybase";
import { createIndexedDbPersister } from "tinybase/persisters/persister-indexed-db/with-schemas";
import { Persister } from "tinybase/persisters/with-schemas";
import { createRelationships } from "tinybase/relationships/with-schemas";
import {
  OptionalSchemas,
  Store,
  Tables,
  TablesSchema,
  createStore,
} from "tinybase/store/with-schemas";

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
export function createStoreWithSchema<T extends TablesSchema>(schema: T) {
  return createStore().setTablesSchema(schema);
}

/**
 * Creates a tinybase persister.
 * @see https://tinybase.org/guides/schemas-and-persistence/persisting-data/
 */
export function createIndexedDBPersisterWithSchema<T extends OptionalSchemas>(
  store: Store<T>,
  name: string,
) {
  return createIndexedDbPersister(store, name);
}

/**
 * Load data from IndexedDB when starting up.
 * @see https://tinybase.org/guides/relationships-and-checkpoints/building-a-ui-with-relationships/
 */
export async function initializePersister<T extends OptionalSchemas>(
  persister: Persister<T> | undefined,
  initialState: Tables<T[0]>,
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
export function createRelationshipsWithSchema<T extends OptionalSchemas>(
  store: Store<T>,
) {
  console.debug("creating relationships.");
  // relate cycles <> packs
  return createRelationships(store).setRelationshipDefinition(
    "packCycles",
    "packs",
    "cycles",
    "cycle_code",
  );
}

/**
 * Workaround for `useCreateRelationships` and potentially other hooks not working under strict mode.
 * @see https://discord.com/channels/1027918215323590676/1193184632301158471/1193195438233370659
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
