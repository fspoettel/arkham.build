import { Decklist } from "@/components/decklist/decklist";
import { Scroller } from "@/components/ui/scroll-area";
import { useStore } from "@/store";
import { selectActiveDeck } from "@/store/selectors/decks";

import { AppLayout } from "../../components/layouts/app-layout";
import { CenterLayout } from "../../components/layouts/center-layout";
import { DeckDetails } from "./deck-details";

export function DeckView() {
  const deck = useStore(selectActiveDeck);

  if (!deck) return null;

  return (
    <AppLayout
      omitSidebarBorder
      sidebar={<DeckDetails deck={deck} />}
      title={`${deck.name}`}
    >
      <CenterLayout>
        <Scroller>
          <Decklist deck={deck} />
        </Scroller>
      </CenterLayout>
    </AppLayout>
  );
}
