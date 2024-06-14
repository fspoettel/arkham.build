import clsx from "clsx";
import { Suspense, lazy, useEffect } from "react";
import { Route, Router, useLocation } from "wouter";
import { useBrowserLocation } from "wouter/use-browser-location";

import css from "./app.module.css";

import { CardModalProvider } from "./components/card-modal/card-modal-context";
import { ToastProvider } from "./components/ui/toast";
import { useStore } from "./store";
import { selectIsInitialized } from "./store/selectors";
import {
  queryCards,
  queryDataVersion,
  queryMetadata,
} from "./store/services/queries";
import { useSyncActiveDeckId } from "./utils/use-sync-active-deck-id";

const Browse = lazy(() => import("./pages/browse/browse"));
const DeckEdit = lazy(() => import("./pages/deck-edit/deck-edit"));
const DeckNew = lazy(() => import("./pages/deck-new/deck-new"));
const DeckView = lazy(() => import("./pages/deck-view/deck-view"));
const Settings = lazy(() => import("./pages/settings/settings"));
const CardView = lazy(() => import("./pages/card-view/card-view"));
const About = lazy(() => import("./pages/about/about"));

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
    <CardModalProvider>
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
              <Route component={About} path="/about" />
              <RouteReset />
            </Router>
          )}
        </Suspense>
      </ToastProvider>
    </CardModalProvider>
  );
}

function RouteReset() {
  const [pathname] = useLocation();

  const toggleFilters = useStore((state) => state.toggleFilters);
  const toggleSidebar = useStore((state) => state.toggleSidebar);

  useSyncActiveDeckId();

  useEffect(() => {
    toggleSidebar(false);
    toggleFilters(false);

    if (window.location.hash) {
      // HACK: this enables hash-based deep links to work when a route is loaded async.
      const el = document.querySelector(window.location.hash);

      if (el) {
        el.scrollIntoView();
        return;
      }
    }

    window.scrollTo(0, 0);
  }, [pathname, toggleSidebar, toggleFilters]);

  return null;
}

export default App;
