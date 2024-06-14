import * as UiReact from "tinybase/ui-react/with-schemas";
import {
  NoValuesSchema,
  OptionalSchemas,
  Persister,
  Store,
  createStore,
} from "tinybase/with-schemas";
import { createIndexedDbPersister } from "tinybase/persisters/persister-indexed-db/with-schemas";
import { TABLE_SCHEMA } from "./schema";

const DATABASE_NAME = "arkham-horror-deck-builder";

/**
 * Create a tinybase store.
 * @see https://tinybase.org/guides/schemas-and-persistence/schema-based-typing/#getting-the-typed-store
 */
export function createAppStore() {
  const store = createStore().setTablesSchema(TABLE_SCHEMA);
  return store;
}

/**
 * Creates a tinybase persister.
 * @see https://tinybase.org/guides/schemas-and-persistence/persisting-data/
 */
export function createAppPersister<T extends OptionalSchemas>(store: Store<T>) {
  return createIndexedDbPersister(store, DATABASE_NAME);
}

/**
 * Load data from IndexedDB when starting up.
 * @see
 */
export async function initPersister<T extends OptionalSchemas>(
  persister?: Persister<T>,
) {
  if (persister) {
    await persister.load();
  }
}

const UiReactWithSchemas = UiReact as UiReact.WithSchemas<
  [typeof TABLE_SCHEMA, NoValuesSchema]
>;

export const { useCreateStore, useCreatePersister, Provider } =
  UiReactWithSchemas;
