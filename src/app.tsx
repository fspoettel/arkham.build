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

function Fallback() {
  return (
    <div className={clsx(css["app-loader"])}>
      <div className={css["app-loader-inner"]}>
        <div className={css["app-loader-icon"]}>
          <i className="icon-auto_fail" />
          <i className="icon-elder_sign" />
        </div>
        <p>Loading...</p>
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
      <Suspense fallback={<Fallback />}>
        {storeInitialized && (
          <Router hook={useBrowserLocation}>
            <Route path="/" component={Browse} />
            <Route path="/card/:code" component={CardView} />
            <Route path="/deck" nest>
              <Route path="/new" component={DeckNew} />
              <Route path="/:id/view" component={DeckView} />
              <Route path="/:id/edit" component={DeckEdit} />
            </Route>
            <Route path="/settings" component={Settings} />
            <RouteReset />
          </Router>
        )}
      </Suspense>
    </ToastProvider>
  );
}

export default App;
