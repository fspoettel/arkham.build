import { useEffect, useState } from "react";
import { createIndexedDbPersister } from "tinybase/persisters/persister-indexed-db/with-schemas";
import { Route, Router } from "wouter";
import { Index } from "./pages";
import { DeckNew } from "./pages/deck_new";
import { DeckEdit } from "./pages/deck_edit";
import { Provider, useCreateStore } from "./stores/DataStore";
import {
  createRelationshipsWithSchema,
  createStoreWithSchema,
  ensureDatabase,
  useCreate,
} from "./stores/utils";
import { tableSchema, valuesSchema } from "./stores/DataStore/schema";
import {
  queryMetadata,
  queryDataVersion,
  queryCards,
} from "./stores/DataStore/sync";
import css from "./app.module.css";
//
function App() {
  const [storeInitialized, setStoreInitialized] = useState(false);
  const store = useCreateStore(() =>
    createStoreWithSchema(tableSchema, valuesSchema),
  );

  const relationships = useCreate(store, () =>
    createRelationshipsWithSchema(store, [
      {
        relationshipId: "packCycles",
        localTableId: "packs",
        remoteTableId: "cycles",
        getRemoteRowId: "cycle_code",
      },
    ]),
  );

  const persister = useCreate(store, () =>
    createIndexedDbPersister(store, "card-data"),
  );

  useEffect(() => {
    async function initPersister() {
      if (persister) {
        console.time("init_indexed_db_persister");
        await ensureDatabase("card-data");
        await persister.load();
        setStoreInitialized(true);
        console.timeEnd("init_indexed_db_persister");
      }
    }
    initPersister().catch(console.error);
  }, [persister]);

  useEffect(() => {
    async function sync() {
      if (storeInitialized) {
        const hasMetadata = Object.keys(store.getTable("cycles") ?? {}).length;

        if (hasMetadata) {
          console.debug("store is initialized, skipping load.");
        } else {
          console.debug("starting initial sync...");
          console.time("sync_metadata");
          const [metadata, dataVersion, cards] = await Promise.all([
            queryMetadata(),
            queryDataVersion(),
            queryCards(),
          ]);

          store.setValues(dataVersion);

          store.setTables({
            ...metadata,
            cards,
          });

          await persister?.save();

          console.timeEnd("sync_metadata");
        }
      }
    }
    sync().catch(console.error);
  }, [storeInitialized, persister, store]);

  return (
    <Provider relationships={relationships} store={store}>
      <Router>
        <div className={css["app"]}>
          <Route path="/" component={Index} />
          <Route path="/deck/new" component={DeckNew} />
          <Route path="/deck/edit/:id" component={DeckEdit} />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
