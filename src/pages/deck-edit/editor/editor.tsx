import { Save } from "lucide-react";
import { useCallback } from "react";
import { useLocation } from "wouter";

import { DeckSummary } from "@/components/deck-summary";
import { DecklistGroups } from "@/components/decklist/decklist-groups";
import { DecklistSection } from "@/components/decklist/decklist-section";
import { Button } from "@/components/ui/button";
import { Scroller } from "@/components/ui/scroller";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/store";
import type { DisplayDeck } from "@/store/lib/deck-grouping";
import { selectCurrentTab } from "@/store/selectors/decks";

import css from "./editor.module.css";

import { InvestigatorListcard } from "./investigator-listcard";
import { MetaEditor } from "./meta-editor";

type Props = {
  className?: string;
  deck: DisplayDeck;
};

function Placeholder({ name }: { name: string }) {
  return <div className={css["editor-placeholder"]}>{name} is empty.</div>;
}

export function Editor({ deck }: Props) {
  const [, navigate] = useLocation();
  const showToast = useToast();

  const dirty = useStore((state) =>
    state?.deckView?.mode === "edit" ? state.deckView.dirty : false,
  );
  const saveDeck = useStore((state) => state.saveDeck);

  const currentTab = useStore(selectCurrentTab);
  const updateActiveTab = useStore((state) => state.updateActiveTab);

  const handleSave = useCallback(() => {
    const id = saveDeck();
    navigate(`/deck/view/${id}`);

    showToast({
      children: "Deck saved successfully.",
      variant: "success",
    });
  }, [saveDeck, navigate, showToast]);

  const handleCancel = useCallback(async () => {
    if (!deck?.id) return;

    const confirmed =
      !dirty ||
      confirm(
        "This operation will revert the changes made to the deck. Do you want to continue?",
      );
    if (confirmed) navigate(`/deck/view/${deck.id}`);
  }, [navigate, deck?.id, dirty]);

  return (
    <div className={css["editor"]}>
      <DeckSummary deck={deck} showValidation />

      <InvestigatorListcard deck={deck} />

      <Tabs
        className={css["editor-tabs"]}
        length={deck.hasExtraDeck ? 4 : 3}
        onValueChange={(value: string) => {
          updateActiveTab(value);
        }}
        value={currentTab}
      >
        <TabsList className={css["editor-tabs-list"]}>
          <TabsTrigger value="slots">Deck</TabsTrigger>
          <TabsTrigger value="sideSlots">Side</TabsTrigger>
          {deck.hasExtraDeck && (
            <TabsTrigger value="extraSlots">Spirits</TabsTrigger>
          )}
          <TabsTrigger value="meta">Meta</TabsTrigger>
        </TabsList>

        <Scroller className={css["editor-tabs-content"]}>
          <TabsContent value="slots">
            <DecklistSection title="Cards">
              <DecklistGroups
                group={deck.groups.main.data}
                ignoredCounts={deck.ignoreDeckLimitSlots ?? undefined}
                layout="two_column"
                mapping="slots"
                ownershipCounts={deck.ownershipCounts}
                quantities={deck.slots}
              />
            </DecklistSection>
            <DecklistSection showTitle title="Special cards">
              <DecklistGroups
                group={deck.groups.special.data}
                ignoredCounts={deck.ignoreDeckLimitSlots ?? undefined}
                layout="two_column"
                mapping="slots"
                ownershipCounts={deck.ownershipCounts}
                quantities={deck.slots}
              />
            </DecklistSection>
            {deck.groups.bonded && deck.bondedSlots && (
              <DecklistSection showTitle title="Bonded cards">
                <DecklistGroups
                  group={deck.groups.bonded.data}
                  layout="two_column"
                  mapping="bonded"
                  ownershipCounts={deck.ownershipCounts}
                  quantities={deck.bondedSlots}
                />
              </DecklistSection>
            )}
          </TabsContent>

          <TabsContent value="sideSlots">
            <DecklistSection title="Side Deck">
              {deck.groups.side?.data ? (
                <DecklistGroups
                  group={deck.groups.side.data}
                  layout="two_column"
                  mapping="side"
                  ownershipCounts={deck.ownershipCounts}
                  quantities={deck.sideSlots ?? undefined}
                />
              ) : (
                <Placeholder name="Side deck" />
              )}
            </DecklistSection>
          </TabsContent>

          {deck.hasExtraDeck && (
            <TabsContent value="extraSlots">
              <DecklistSection title="Spirits">
                {deck.groups.extra?.data ? (
                  <DecklistGroups
                    group={deck.groups.extra.data}
                    layout="one_column"
                    mapping="extraSlots"
                    ownershipCounts={deck.ownershipCounts}
                    quantities={deck.extraSlots ?? undefined}
                  />
                ) : (
                  <Placeholder name="Spirit deck" />
                )}
              </DecklistSection>
            </TabsContent>
          )}

          <TabsContent value="meta">
            <MetaEditor deck={deck} />
          </TabsContent>
        </Scroller>

        <div className={css["actions"]}>
          <Button onClick={handleSave}>
            <Save />
            Save
          </Button>
          <Button onClick={handleCancel} variant="bare">
            Cancel edits
          </Button>
        </div>
      </Tabs>
    </div>
  );
}
