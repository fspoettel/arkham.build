import { useEffect } from "react";
import { Route, Router } from "wouter";

import { ToastProvider } from "./components/ui/toast";
import { Index } from "./pages";
import { CardView } from "./pages/card-view/card-view";
import { DeckEdit } from "./pages/deck-edit";
import { DeckNew } from "./pages/deck-new";
import { Settings } from "./pages/settings/settings";
import { useStore } from "./store";

function App() {
  const storeHydrated = useStore((state) => state.ui.hydrated);
  const init = useStore((state) => state.init);

  useEffect(() => {
    if (storeHydrated) init().catch(console.error);
  }, [storeHydrated, init]);

  return (
    <ToastProvider>
      <Router>
        <Route path="/" component={Index} />
        <Route path="/card/:code" component={CardView} />
        <Route path="/deck/new" component={DeckNew} />
        <Route path="/deck/edit/:id" component={DeckEdit} />
        <Route path="/settings" component={Settings} />
      </Router>
    </ToastProvider>
  );
}

export default App;
