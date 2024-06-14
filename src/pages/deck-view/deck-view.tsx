import { useEffect } from "react";
import { useParams } from "wouter";

import { Decklist } from "@/components/decklist/decklist";
import { Scroller } from "@/components/ui/scroll-area";
import { useStore } from "@/store";
import { selectLocalDeck } from "@/store/selectors/decks";

import { AppLayout } from "../../components/layouts/app-layout";
import { CenterLayout } from "../../components/layouts/center-layout";
import { DeckDetails } from "./deck-details";

export function DeckView() {
  const { id } = useParams();

  const deck = useStore((state) => selectLocalDeck(state, id));

  const setActiveDeckId = useStore((state) => state.setActiveDeckId);

  useEffect(() => {
    setActiveDeckId(id);
    return () => setActiveDeckId(undefined);
  }, [setActiveDeckId, id]);

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
