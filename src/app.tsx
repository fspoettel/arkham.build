import { useEffect, useState } from "react";
import { Route, Router } from "wouter";
import { Index } from "./pages";
import { DeckNew } from "./pages/deck_new";
import { DeckEdit } from "./pages/deck_edit";
import { useStore } from "./store";
import css from "./app.module.css";
//
function App() {
  const [storeInitialized, setStoreInitialized] = useState(false);

  const dataVersion = useStore((state) => state.dataVersion);
  const syncData = useStore((state) => state.sync);

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
          console.time("sync_metadata");
          await syncData();
          console.timeEnd("sync_metadata");
        }
      }
    }
    sync().catch(console.error);
  }, [storeInitialized, dataVersion, syncData]);

  return (
    <Router>
      <div className={css["app"]}>
        <Route path="/" component={Index} />
        <Route path="/deck/new" component={DeckNew} />
        <Route path="/deck/edit/:id" component={DeckEdit} />
      </div>
    </Router>
  );
}

export default App;
