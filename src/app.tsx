import { Route, Router } from "wouter";
import { Index } from "./pages";
import { DeckNew } from "./pages/deck_new";
import { DeckEdit } from "./pages/deck_edit";

import css from "./app.module.css";
import {
  Provider,
  createAppPersister,
  createAppStore,
  initPersister,
  useCreatePersister,
  useCreateStore,
} from "./store";

function App() {
  const store = useCreateStore(createAppStore);

  useCreatePersister(store, createAppPersister, [], initPersister);

  return (
    <Provider>
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
