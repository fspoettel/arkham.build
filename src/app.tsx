import { Suspense, lazy, useEffect, useRef } from "react";
import { Route, Router, Switch, useLocation } from "wouter";
import { useBrowserLocation } from "wouter/use-browser-location";
import { ErrorBoundary } from "./components/error-boundary";
import { Loader } from "./components/ui/loader";
import { ToastProvider } from "./components/ui/toast";
import { useToast } from "./components/ui/toast.hooks";
import { Connect } from "./pages/connect/connect";
import { Error404 } from "./pages/errors/404";
import { CardDataSync } from "./pages/settings/card-data-sync";
import { useStore } from "./store";
import { useSync } from "./store/hooks/use-sync";
import { selectSettings } from "./store/selectors/settings";
import { selectIsInitialized } from "./store/selectors/shared";
import {
  queryCards,
  queryDataVersion,
  queryMetadata,
} from "./store/services/queries";
import { useColorTheme } from "./utils/use-color-theme";
import { useVisibilityChange } from "./utils/use-document-visibility";

const Browse = lazy(() => import("./pages/browse/browse"));
const DeckEdit = lazy(() => import("./pages/deck-edit/deck-edit"));
const ChooseInvestigator = lazy(
  () => import("./pages/choose-investigator/choose-investigator"),
);
const DeckCreate = lazy(() => import("./pages/deck-create/deck-create"));
const DeckView = lazy(() => import("./pages/deck-view/deck-view"));
const Settings = lazy(() => import("./pages/settings/settings"));
const CardView = lazy(() => import("./pages/card-view/card-view"));
const CardViewUsable = lazy(() => import("./pages/card-view/usable-cards"));
const About = lazy(() => import("./pages/about/about"));
const Share = lazy(() => import("./pages/share/share"));
const CollectionStats = lazy(
  () => import("./pages/collection-stats/collection-stats"),
);

function App() {
  return (
    <Providers>
      <AppInner />
    </Providers>
  );
}

function Providers(props: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ToastProvider>{props.children}</ToastProvider>
    </ErrorBoundary>
  );
}

function AppInner() {
  const toast = useToast();
  const storeHydrated = useStore((state) => state.ui.hydrated);
  const storeInitialized = useStore(selectIsInitialized);
  const settings = useStore(selectSettings);
  const init = useStore((state) => state.init);

  useColorTheme();

  // !!!HACK!!!
  // part of the ~~hack~~ workaround for https://github.com/radix-ui/primitives/issues/2777 / https://bugzilla.mozilla.org/show_bug.cgi?id=1885232.
  // make sure pointer events are re-enabled when the tab is focused - we disable them on pointerdown for slider and scrollarea
  // and changing the tab while the pointer is down will leave the page in a state where pointer events are disabled.
  // FIXME: remove this when Firefox fixes this bug, alongside the package patches.
  useVisibilityChange(() => {
    document.body.style.pointerEvents = "auto";
  });

  useEffect(() => {
    async function initStore() {
      if (storeHydrated) {
        try {
          await init(queryMetadata, queryDataVersion, queryCards, false);
        } catch (err) {
          console.error(err);
          toast.show({
            children: `Failed to initialize card database: ${(err as Error)?.message}`,
            variant: "error",
          });
        }
      }
    }

    initStore().catch(console.error);
  }, [storeHydrated, init, toast.show]);

  useEffect(() => {
    if (storeHydrated) {
      document.documentElement.style.fontSize = `${settings.fontSize}%`;
    }
  }, [storeHydrated, settings.fontSize]);

  return (
    <>
      <Loader
        message="Initializing card database..."
        show={storeHydrated && !storeInitialized}
      />
      <Suspense fallback={<Loader delay={200} show />}>
        {storeInitialized && (
          <Router hook={useBrowserLocation}>
            <Switch>
              <Route component={Browse} path="/" />
              <Route component={CardView} path="/card/:code" />
              <Route
                component={CardViewUsable}
                path="/card/:code/usable_cards"
              />
              <Route component={ChooseInvestigator} path="/deck/create" />
              <Route component={DeckCreate} path="/deck/create/:code" />
              <Route component={DeckView} path="/:type/view/:id" />
              <Route component={DeckView} path="/:type/view/:id/:slug" />
              <Route component={DeckEdit} nest path="/deck/edit/:id" />
              <Route component={Settings} path="/settings" />
              <Route component={About} path="/about" />
              <Route component={Share} path="/share/:id" />
              <Route component={CollectionStats} path="/collection-stats" />
              <Route component={Connect} path="/connect" />
              <Route component={Error404} path="*" />
            </Switch>
            <RouteReset />
            <AppTasks />
          </Router>
        )}
      </Suspense>
    </>
  );
}

function RouteReset() {
  const [pathname] = useLocation();

  // biome-ignore lint/correctness/useExhaustiveDependencies: a change to pathname indicates a change to window.location.
  useEffect(() => {
    if (window.location.hash) {
      // HACK: this enables hash-based deep links to work when a route is loaded async.
      const el = document.querySelector(window.location.hash);

      if (el) {
        el.scrollIntoView();
        return;
      }
    }

    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function AppTasks() {
  const dataVersion = useStore((state) => state.metadata.dataVersion);
  const lastSyncedAt = useStore((state) => state.connections.lastSyncedAt);

  const sync = useSync();
  const toast = useToast();
  const [location] = useLocation();
  const toastId = useRef<string>();

  const cardDataLock = useRef(false);

  useEffect(() => {
    async function updateCardData() {
      if (cardDataLock.current) return;
      cardDataLock.current = true;

      const data = await queryDataVersion();

      const upToDate =
        data &&
        dataVersion &&
        data.cards_updated_at === dataVersion.cards_updated_at;

      if (!upToDate && !toastId.current) {
        toastId.current = toast.show({
          children: (
            <div>
              <CardDataSync
                onSyncComplete={() => {
                  if (toastId.current) {
                    toast.dismiss(toastId.current);
                    toastId.current = undefined;
                  }
                }}
              />
            </div>
          ),
          persistent: true,
        });
      }
    }

    if (
      location !== "/settings" &&
      location !== "/connect" &&
      !cardDataLock.current
    ) {
      updateCardData().catch(console.error);
    }
  }, [dataVersion, toast.dismiss, toast.show, location]);

  const autoSyncLock = useRef(false);

  useEffect(() => {
    if (
      location !== "/settings" &&
      location !== "/connect" &&
      (!lastSyncedAt || Date.now() - lastSyncedAt > 30 * 60 * 1000) &&
      !autoSyncLock.current
    ) {
      autoSyncLock.current = true;
      sync().catch(console.error);
    }
  }, [sync, location, lastSyncedAt]);

  return null;
}

export default App;
