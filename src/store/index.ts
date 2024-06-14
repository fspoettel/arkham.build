import * as UiReact from "tinybase/ui-react/with-schemas";
import {
  NoValuesSchema,
  OptionalSchemas,
  Persister,
  Store,
  createRelationships,
  createStore,
} from "tinybase/with-schemas";
import { createIndexedDbPersister } from "tinybase/persisters/persister-indexed-db/with-schemas";
import { getInitialState, tableSchema } from "./state";
import { DependencyList, useEffect, useState } from "react";

export const DATABASE_NAME = "arkham-horror-deck-builder";

/**
 * Create a tinybase store.
 * @see https://tinybase.org/guides/schemas-and-persistence/schema-based-typing/#getting-the-typed-store
 */
export function createAppStore() {
  console.debug("creating store.");
  return createStore().setTablesSchema(tableSchema);
}

/**
 * Creates a tinybase persister.
 * @see https://tinybase.org/guides/schemas-and-persistence/persisting-data/
 */
export function createAppPersister<T extends OptionalSchemas>(store: Store<T>) {
  console.debug("creating IndexedDB persister.");
  return createIndexedDbPersister(store, DATABASE_NAME);
}

/**
 * Creates relationships for a tinybase store.
 * @see https://tinybase.org/guides/relationships-and-checkpoints/building-a-ui-with-relationships/
 */
export function createAppRelationships<T extends OptionalSchemas>(
  store: Store<T>,
) {
  console.debug("creating relationships: packCycles.");
  // relate cycles <> packs
  return createRelationships(store).setRelationshipDefinition(
    "packCycles",
    "packs",
    "cycles",
    "cycle_code",
  );
}

/**
 * Load data from IndexedDB when starting up.
 * @see https://tinybase.org/guides/relationships-and-checkpoints/building-a-ui-with-relationships/
 */
export async function initPersister<T extends OptionalSchemas>(
  persister?: Persister<T>,
) {
  if (persister) {
    console.debug("loading data from persistence layer.");
    await persister.startAutoLoad(getInitialState());
    console.debug("enabling persistence.");
    await persister.startAutoSave();
    console.debug("finished setting up persistence.");
  }
}

const UiReactWithSchemas = UiReact as UiReact.WithSchemas<
  [typeof tableSchema, NoValuesSchema]
>;

export const {
  Provider,
  useCreatePersister,
  useCreateStore,
  useLocalRowIds,
  useRelationships,
  useRemoteRowId,
  useStore,
  useTable,
  useTables,
} = UiReactWithSchemas;

interface Destroyable {
  destroy(): void;
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
