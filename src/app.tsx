import { Route, Router } from "wouter";
import { Index } from "./pages";
import { DeckNew } from "./pages/deck_new";
import { DeckEdit } from "./pages/deck_edit";

import css from "./app.module.css";
import {
  Provider,
  getInitialState,
  tableSchema,
  useCreatePersister,
  useCreateStore,
} from "./stores/DataStore";
import {
  createIndexedDBPersisterWithSchema,
  createRelationshipsWithSchema,
  createStoreWithSchema,
  initializePersister,
  useCreate,
} from "./stores/utils";

function App() {
  const store = useCreateStore(() => createStoreWithSchema(tableSchema));

  const relationships = useCreate(store, createRelationshipsWithSchema);
  useCreatePersister(
    store,
    (store) => createIndexedDBPersisterWithSchema(store, "card-data"),
    [],
    (persister) => initializePersister(persister, getInitialState()),
  );

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
