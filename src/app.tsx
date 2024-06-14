import { useEffect, useState } from "react";
import { Route, Router } from "wouter";
import { Index } from "./pages";
import { DeckNew } from "./pages/deck-new";
import { DeckEdit } from "./pages/deck-edit";
import { CardView } from "./pages/card-view";
import { useStore } from "./store";
import css from "./app.module.css";

function App() {
  const [storeInitialized, setStoreInitialized] = useState(false);

  const init = useStore((state) => state.init);
  const dataVersion = useStore((state) => state.metadata.dataVersion);

  useEffect(() => {
    const unsub = useStore.persist.onFinishHydration(() => {
      setStoreInitialized(true);
    });

    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    async function sync() {
      if (storeInitialized) {
        if (dataVersion?.cards_updated_at) {
          console.debug(
            `skipping sync, card data version: ${dataVersion.cards_updated_at}`,
          );
        } else {
          console.debug("starting sync...");
          await init();
        }
      }
    }

    sync().catch(console.error);
  }, [storeInitialized, dataVersion, init]);

  return (
    <Router>
      <div className={css["app"]}>
        <Route path="/" component={Index} />
        <Route path="/card/:code" component={CardView} />
        <Route path="/deck/new" component={DeckNew} />
        <Route path="/deck/edit/:id" component={DeckEdit} />
      </div>
    </Router>
  );
}

export default App;
