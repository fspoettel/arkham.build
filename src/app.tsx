import clsx from "clsx";
import React, { Suspense, useEffect } from "react";
import { Route, Router } from "wouter";
import { useBrowserLocation } from "wouter/use-browser-location";

import css from "./app.module.css";

import RouteReset from "./components/route-reset";
import { ToastProvider } from "./components/ui/toast";
import { useStore } from "./store";
import { selectIsInitialized } from "./store/selectors";
import {
  queryCards,
  queryDataVersion,
  queryMetadata,
} from "./store/services/queries";

const Browse = React.lazy(() => import("./pages/browse"));
const DeckEdit = React.lazy(() => import("./pages/deck-edit/deck-edit"));
const DeckNew = React.lazy(() => import("./pages/deck-new"));
const DeckView = React.lazy(() => import("./pages/deck-view/deck-view"));
const Settings = React.lazy(() => import("./pages/settings/settings"));
const CardView = React.lazy(() => import("./pages/card-view/card-view"));

function Fallback({ message, show }: { message?: string; show?: boolean }) {
  return (
    <div className={clsx(css["app-loader"], show && css["show"])}>
      <div className={css["app-loader-inner"]}>
        <div className={css["app-loader-icon"]}>
          <i className="icon-auto_fail" />
          <i className="icon-elder_sign" />
        </div>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
}

function App() {
  const storeHydrated = useStore((state) => state.ui.hydrated);
  const storeInitialized = useStore(selectIsInitialized);
  const init = useStore((state) => state.init);

  useEffect(() => {
    if (storeHydrated)
      init(queryMetadata, queryDataVersion, queryCards, false).catch(
        console.error,
      );
  }, [storeHydrated, init]);

  return (
    <ToastProvider>
      <Fallback
        message="Loading card data..."
        show={storeHydrated && !storeInitialized}
      />
      <Suspense fallback={<Fallback show />}>
        {storeInitialized && (
          <Router hook={useBrowserLocation}>
            <Route component={Browse} path="/" />
            <Route component={CardView} path="/card/:code" />
            <Route nest path="/deck">
              <Route component={DeckNew} path="/new" />
              <Route component={DeckView} path="/:id/view" />
              <Route component={DeckEdit} path="/:id/edit" />
            </Route>
            <Route component={Settings} path="/settings" />
            <RouteReset />
          </Router>
        )}
      </Suspense>
    </ToastProvider>
  );
}

export default App;
