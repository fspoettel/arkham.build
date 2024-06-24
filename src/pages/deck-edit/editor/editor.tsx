import { DeckSummary } from "@/components/deck-summary";
import { DecklistGroups } from "@/components/decklist/decklist-groups";
import { DecklistSection } from "@/components/decklist/decklist-section";
import { Scroller } from "@/components/ui/scroller";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DisplayDeck } from "@/store/lib/deck-grouping";
import type { DeckValidationResult } from "@/store/lib/deck-validation";
import type { Tab } from "@/store/slices/deck-edits.types";

import css from "./editor.module.css";

import { EditorActions } from "./editor-actions";
import { InvestigatorListcard } from "./investigator-listcard";
import { MetaEditor } from "./meta-editor";

type Props = {
  className?: string;
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
  deck: DisplayDeck;
  validation?: DeckValidationResult;
};

export function Editor({ currentTab, deck, onTabChange, validation }: Props) {
  return (
    <div className={css["editor"]}>
      <DeckSummary deck={deck} validation={validation} />

      <InvestigatorListcard deck={deck} />

      <Tabs
        className={css["editor-tabs"]}
        length={deck.hasExtraDeck ? 4 : 3}
        onValueChange={(value: string) => {
          onTabChange(value as Tab);
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
        <EditorActions deck={deck} />
      </Tabs>
    </div>
  );
}

function Placeholder({ name }: { name: string }) {
  return <div className={css["editor-placeholder"]}>{name} is empty.</div>;
}
