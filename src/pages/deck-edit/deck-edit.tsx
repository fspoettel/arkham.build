import { Undo } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Redirect, useParams } from "wouter";

import { ListLayout } from "@//layouts/list-layout";
import { CardList } from "@/components/card-list/card-list";
import { CardModalProvider } from "@/components/card-modal/card-modal-context";
import { DecklistValidation } from "@/components/decklist/decklist-validation";
import { Filters } from "@/components/filters/filters";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/store";
import type { DisplayDeck } from "@/store/lib/deck-grouping";
import {
  selectActiveDeckById,
  selectDeckValidById,
} from "@/store/selectors/deck-view";
import { type Tab, mapTabToSlot } from "@/store/slices/deck-edits.types";
import { DeckIdProvider } from "@/utils/use-deck-id";
import { useDocumentTitle } from "@/utils/use-document-title";

import { Editor } from "./editor/editor";
import { ShowUnusableCardsToggle } from "./show-unusable-cards-toggle";

function DeckEdit() {
  const { id } = useParams<{ id: string }>();

  const showToast = useToast();
  const activeListId = useStore((state) => state.activeList);
  const resetFilters = useStore((state) => state.resetFilters);
  const setActiveList = useStore((state) => state.setActiveList);
  const discardEdits = useStore((state) => state.discardEdits);
  const deck = useStore((state) => selectActiveDeckById(state, id, true));
  const changes = useStore((state) => state.deckEdits[id]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: we only want to run this effect once on mount.
  useEffect(() => {
    if (changes) {
      showToast({
        children({ handleClose }) {
          return (
            <>
              Unsaved changes were restored.
              <div>
                <Button onClick={handleClose} size="sm">
                  OK
                </Button>
                <Button
                  onClick={() => {
                    discardEdits(id);
                    handleClose();
                  }}
                  size="sm"
                >
                  <Undo />
                  Revert
                </Button>
              </div>
            </>
          );
        },
        variant: "success",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discardEdits, id, showToast]);

  useEffect(() => {
    setActiveList("editor_player");

    return () => {
      resetFilters();
    };
  }, [setActiveList, resetFilters]);

  if (id && !deck) {
    return <Redirect to="/404" />;
  }

  if (!deck || !activeListId?.startsWith("editor")) return null;

  return (
    <DeckIdProvider canEdit deckId={deck.id}>
      <CardModalProvider>
        <DeckEditInner deck={deck} />
      </CardModalProvider>
    </DeckIdProvider>
  );
}

function DeckEditInner({ deck }: { deck: DisplayDeck }) {
  const [currentTab, setCurrentTab] = useState<Tab>("slots");

  const updateCardQuantity = useStore((state) => state.updateCardQuantity);

  const validation = useStore((state) =>
    selectDeckValidById(state, deck.id, true),
  );

  useDocumentTitle(
    deck ? `Edit: ${deck.investigatorFront.card.real_name} - ${deck.name}` : "",
  );

  const onChangeCardQuantity = useMemo(() => {
    return (code: string, quantity: number) => {
      updateCardQuantity(deck.id, code, quantity, mapTabToSlot(currentTab));
    };
  }, [updateCardQuantity, currentTab, deck.id]);

  return (
    <ListLayout
      filters={
        <Filters>
          <DecklistValidation defaultOpen={false} validation={validation} />
          <ShowUnusableCardsToggle />
        </Filters>
      }
      sidebar={
        <Editor
          currentTab={currentTab}
          deck={deck}
          onTabChange={setCurrentTab}
          validation={validation}
        />
      }
      sidebarWidthMax="42rem"
    >
      {(props) => (
        <CardList
          {...props}
          onChangeCardQuantity={onChangeCardQuantity}
          quantities={deck[mapTabToSlot(currentTab)] ?? undefined}
          targetDeck={
            mapTabToSlot(currentTab) === "extraSlots" ? "extraSlots" : "slots"
          }
        />
      )}
    </ListLayout>
  );
}

export default DeckEdit;
