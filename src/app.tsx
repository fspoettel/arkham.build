import { Route, Router } from "wouter";
import { Index } from "./pages";
import { DeckNew } from "./pages/deck_new";
import { DeckEdit } from "./pages/deck_edit";

import css from "./app.module.css";

function App() {
  return (
    <div className={css["app"]}>
      <Router>
        <Route path="/" component={Index} />
        <Route path="/deck/new" component={DeckNew} />
        <Route path="/deck/edit/:id" component={DeckEdit} />
      </Router>
    </div>
  );
}

export default App;
