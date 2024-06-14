import { Suspense, lazy, useEffect } from "react";
import { Route, Router, useLocation } from "wouter";
import { useBrowserLocation } from "wouter/use-browser-location";

import { CardModalProvider } from "./components/card-modal/card-modal-context";
import { Loader } from "./components/ui/loader";
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
const DeckCreateChooseInvestigator = lazy(
  () => import("./pages/deck-create/deck-create-choose-investigator"),
);
const DeckCreate = lazy(() => import("./pages/deck-create/deck-create"));
const DeckView = lazy(() => import("./pages/deck-view/deck-view"));
const Settings = lazy(() => import("./pages/settings/settings"));
const CardView = lazy(() => import("./pages/card-view/card-view"));
const About = lazy(() => import("./pages/about/about"));

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
        <Loader
          message="Initializing card database..."
          show={storeHydrated && !storeInitialized}
        />
        <Suspense fallback={<Loader delay={200} show />}>
          {storeInitialized && (
            <Router hook={useBrowserLocation}>
              <Route component={Browse} path="/" />
              <Route component={CardView} path="/card/:code" />
              <Route nest path="/deck">
                <Route
                  component={DeckCreateChooseInvestigator}
                  path="/create"
                />
                <Route component={DeckCreate} path="/create/:code" />
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
