import { Undo } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "wouter";

import { ListLayout } from "@//layouts/list-layout";
import { CardList } from "@/components/card-list/card-list";
import { CardModalProvider } from "@/components/card-modal/card-modal-context";
import { DecklistValidation } from "@/components/decklist/decklist-validation";
import { Filters } from "@/components/filters/filters";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/store";
import {
  selectDeckValid,
  selectResolvedDeckById,
} from "@/store/selectors/deck-view";
import { type Tab, mapTabToSlot } from "@/store/slices/deck-edits.types";
import { useDocumentTitle } from "@/utils/use-document-title";

import { Editor } from "./editor/editor";
import { ShowUnusableCardsToggle } from "./show-unusable-cards-toggle";

import type { ResolvedDeck } from "@/store/lib/types";
import { ResolvedDeckProvider } from "@/utils/use-resolved-deck";
import { Error404 } from "../errors/404";
import css from "./deck-edit.module.css";

function DeckEdit() {
  const { id } = useParams<{ id: string }>();

  const showToast = useToast();
  const activeListId = useStore((state) => state.activeList);
  const resetFilters = useStore((state) => state.resetFilters);
  const setActiveList = useStore((state) => state.setActiveList);
  const discardEdits = useStore((state) => state.discardEdits);
  const deck = useStore((state) => selectResolvedDeckById(state, id, true));
  const changes = useStore((state) => state.deckEdits[id]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: we only want to run this effect once on mount.
  useEffect(() => {
    if (changes) {
      showToast({
        children({ onClose }) {
          return (
            <>
              Unsaved changes were restored.
              <div className={css["restore"]}>
                <Button onClick={onClose} size="sm">
                  OK
                </Button>
                <Button
                  onClick={() => {
                    discardEdits(id);
                    onClose();
                  }}
                  size="sm"
                >
                  <Undo />
                  Undo
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
    return <Error404 />;
  }

  if (!deck || !activeListId?.startsWith("editor")) return null;

  return (
    <ResolvedDeckProvider canEdit resolvedDeck={deck}>
      <CardModalProvider>
        <DeckEditInner deck={deck} />
      </CardModalProvider>
    </ResolvedDeckProvider>
  );
}

function DeckEditInner({ deck }: { deck: ResolvedDeck }) {
  const [currentTab, setCurrentTab] = useState<Tab>("slots");

  const updateCardQuantity = useStore((state) => state.updateCardQuantity);

  const validation = useStore((state) => selectDeckValid(state, deck));

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
      sidebarWidthMax="45rem"
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
