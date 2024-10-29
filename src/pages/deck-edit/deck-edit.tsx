import { Undo } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "wouter";

import { ListLayout } from "@//layouts/list-layout";
import { CardList } from "@/components/card-list/card-list";
import { CardModalProvider } from "@/components/card-modal/card-modal-context";
import { DecklistValidation } from "@/components/decklist/decklist-validation";
import { Filters } from "@/components/filters/filters";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast.hooks";
import { useStore } from "@/store";
import {
  selectDeckValid,
  selectResolvedDeckById,
} from "@/store/selectors/decks";
import { type Tab, mapTabToSlot } from "@/store/slices/deck-edits.types";
import { useDocumentTitle } from "@/utils/use-document-title";

import { Editor } from "./editor/editor";
import { ShowUnusableCardsToggle } from "./show-unusable-cards-toggle";

import { Attachments } from "@/components/attachments/attachments";
import { DeckTools } from "@/components/deck-tools/deck-tools";
import type { ResolvedDeck } from "@/store/lib/types";
import type { Card } from "@/store/services/queries.types";
import { SPECIAL_CARD_CODES } from "@/utils/constants";
import { ResolvedDeckProvider } from "@/utils/use-resolved-deck";
import { Error404 } from "../errors/404";
import css from "./deck-edit.module.css";
import { DrawBasicWeakness } from "./editor/draw-basic-weakness";

function DeckEdit() {
  const { id } = useParams<{ id: string }>();

  const toast = useToast();
  const activeListId = useStore((state) => state.activeList);
  const resetFilters = useStore((state) => state.resetFilters);
  const setActiveList = useStore((state) => state.setActiveList);
  const discardEdits = useStore((state) => state.discardEdits);
  const deck = useStore((state) => selectResolvedDeckById(state, id, true));
  const changes = useStore((state) => state.deckEdits[id]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: we only want to run this effect once on mount.
  useEffect(() => {
    let toastId: string | null = null;

    if (changes) {
      toastId = toast.show({
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

    return () => {
      if (toastId) {
        toast.dismiss(toastId);
      }
    };
  }, [discardEdits, id, toast]);

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

  const renderListCardAfter = useCallback(
    (card: Card, quantity: number | undefined) => {
      return card.code === SPECIAL_CARD_CODES.RANDOM_BASIC_WEAKNESS ? (
        <DrawBasicWeakness deckId={deck.id} quantity={quantity} />
      ) : (
        <Attachments card={card} resolvedDeck={deck} />
      );
    },
    [deck],
  );

  const setUsingDeckTools = useStore((state) => state.setUsingDeckTools);
  // biome-ignore lint/correctness/useExhaustiveDependencies: Only once on mount
  useEffect(() => setUsingDeckTools(false), []);

  const updateCardQuantity = useStore((state) => state.updateCardQuantity);
  const validation = useStore((state) => selectDeckValid(state, deck));

  useDocumentTitle(
    deck ? `Edit: ${deck.investigatorFront.card.real_name} - ${deck.name}` : "",
  );

  const onChangeCardQuantity = useMemo(() => {
    return (card: Card, quantity: number, limit: number) => {
      updateCardQuantity(
        deck.id,
        card.code,
        quantity,
        limit,
        mapTabToSlot(currentTab),
      );
    };
  }, [updateCardQuantity, currentTab, deck.id]);

  return (
    <ListLayout
      filters={
        <Filters>
          <DecklistValidation
            defaultOpen={validation.errors.length < 3}
            validation={validation}
          />
          <ShowUnusableCardsToggle />
        </Filters>
      }
      sidebar={
        <Editor
          currentTab={currentTab}
          deck={deck}
          onTabChange={setCurrentTab}
          renderListCardAfter={renderListCardAfter}
          validation={validation}
        />
      }
      extras={<DeckTools deck={deck} />}
      sidebarWidthMax="var(--sidebar-width-two-col)"
    >
      {(props) => (
        <CardList
          {...props}
          onChangeCardQuantity={onChangeCardQuantity}
          quantities={deck[mapTabToSlot(currentTab)] ?? undefined}
          renderListCardAfter={renderListCardAfter}
          targetDeck={
            mapTabToSlot(currentTab) === "extraSlots" ? "extraSlots" : "slots"
          }
        />
      )}
    </ListLayout>
  );
}

export default DeckEdit;
