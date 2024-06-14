import { useEffect } from "react";
import { Route, Router } from "wouter";

import { Index } from "./pages";
import { CardView } from "./pages/card-view";
import { DeckEdit } from "./pages/deck-edit";
import { DeckNew } from "./pages/deck-new";
import { Settings } from "./pages/settings";
import { useStore } from "./store";

function App() {
  const storeInitialized = useStore((state) => state.ui.initialized);

  const init = useStore((state) => state.init);
  const dataVersion = useStore((state) => state.metadata.dataVersion);

  useEffect(() => {
    async function sync() {
      if (storeInitialized) {
        if (dataVersion?.cards_updated_at) {
          console.debug(`[sync] skip, card data present.`);
        } else {
          console.debug("[sync]  starting initial sync.");
          await init();
        }
      }
    }
    sync().catch(console.error);
  }, [storeInitialized, dataVersion, init]);

  return (
    <Router>
      <Route path="/" component={Index} />
      <Route path="/card/:code" component={CardView} />
      <Route path="/deck/new" component={DeckNew} />
      <Route path="/deck/edit/:id" component={DeckEdit} />
      <Route path="/settings" component={Settings} />
    </Router>
  );
}

export default App;
