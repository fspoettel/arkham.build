import { Route, Router } from "wouter";
import { Index } from "./pages";
import { DeckNew } from "./pages/deck_new";
import { DeckEdit } from "./pages/deck_edit";

import css from "./app.module.css";
import {
  Provider,
  createAppPersister,
  createAppRelationships,
  createAppStore,
  initPersister,
  useCreate,
  useCreatePersister,
  useCreateStore,
} from "./store";

function App() {
  const store = useCreateStore(createAppStore);
  const relationships = useCreate(store, createAppRelationships);
  useCreatePersister(store, createAppPersister, [], initPersister);

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
