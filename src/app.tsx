import clsx from "clsx";
import { useEffect } from "react";
import { Route, Router } from "wouter";

import css from "./app.module.css";

import RouteReset from "./components/route-reset";
import { ToastProvider } from "./components/ui/toast";
import { Index } from "./pages";
import { CardView } from "./pages/card-view/card-view";
import { DeckEdit } from "./pages/deck-edit";
import { DeckNew } from "./pages/deck-new";
import { Settings } from "./pages/settings/settings";
import { useStore } from "./store";
import { selectIsInitialized } from "./store/selectors";

function App() {
  const storeHydrated = useStore((state) => state.ui.hydrated);
  const storeInitialized = useStore(selectIsInitialized);
  const init = useStore((state) => state.init);

  useEffect(() => {
    if (storeHydrated) init().catch(console.error);
  }, [storeHydrated, init]);

  return (
    <ToastProvider>
      <div
        className={clsx(
          css["app-loader"],
          storeHydrated && !storeInitialized && css["show"],
        )}
      >
        <div className={css["app-loader-inner"]}>
          <div className={css["app-loader-icon"]}>
            <i className="icon-text icon-auto_fail" />
            <i className="icon-text icon-elder_sign" />
          </div>
          <p>Loading card data...</p>
        </div>
      </div>
      <Router>
        <Route path="/" component={Index} />
        <Route path="/card/:code" component={CardView} />
        <Route path="/deck/new" component={DeckNew} />
        <Route path="/deck/edit/:id" component={DeckEdit} />
        <Route path="/settings" component={Settings} />
        <RouteReset />
      </Router>
    </ToastProvider>
  );
}

export default App;
