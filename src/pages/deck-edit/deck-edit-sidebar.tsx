import { ListCard } from "@/components/card-list/list-card";
import { DeckCard } from "@/components/deck-collection/deck";
import { DeckInvestigator } from "@/components/deck-investigator/deck-investigator";
import { DecklistGroups } from "@/components/decklist/decklist-groups";
import { DecklistSection } from "@/components/decklist/decklist-section";
import { Scroller } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/store";
import type { DisplayDeck } from "@/store/lib/deck-grouping";
import { selectCurrentTab } from "@/store/selectors/decks";

import css from "./deck-edit.module.css";

import { DeckEditMeta } from "./deck-edit-meta";

type Props = {
  className?: string;
  deck: DisplayDeck;
};

export function DeckEditSidebar({ deck }: Props) {
  const currentTab = useStore(selectCurrentTab);
  const updateActiveTab = useStore((state) => state.updateActiveTab);

  return (
    <div className={css["deck-edit-sidebar"]}>
      <DeckCard deck={deck} showThumbnail={false} />
      <ListCard
        card={deck.investigatorFront.card}
        tooltip={<DeckInvestigator deck={deck} canToggleBack={false} />}
      />
      <Scroller className={css["deck-edit-sidebar-cards"]}>
        <Tabs
          className={css["deck-edit-sidebar-tabs"]}
          length={deck.hasExtraDeck ? 4 : 3}
          onValueChange={(value: string) => {
            updateActiveTab(value);
          }}
          value={currentTab}
        >
          <TabsList className={css["deck-edit-sidebar-tabs-list"]}>
            <TabsTrigger value="slots">Deck</TabsTrigger>
            <TabsTrigger value="sideSlots">Side</TabsTrigger>
            {deck.hasExtraDeck && (
              <TabsTrigger value="extraSlots">Extra</TabsTrigger>
            )}
            <TabsTrigger value="meta">Meta</TabsTrigger>
          </TabsList>
          <TabsContent
            className={css["deck-edit-sidebar-tabs-content"]}
            value="slots"
          >
            <DecklistSection title="Cards">
              <DecklistGroups
                canEdit
                group={deck.groups.main.data}
                layout="two_column"
                quantities={deck.slots}
              />
            </DecklistSection>
            <DecklistSection title="Special cards" showTitle>
              <DecklistGroups
                canEdit
                group={deck.groups.special.data}
                layout="two_column"
                quantities={deck.slots}
              />
            </DecklistSection>
            {deck.groups.bonded && deck.bondedSlots && (
              <DecklistSection title="Bonded cards" showTitle>
                <DecklistGroups
                  group={deck.groups.bonded.data}
                  layout="two_column"
                  quantities={deck.bondedSlots}
                />
              </DecklistSection>
            )}
          </TabsContent>
          <TabsContent
            className={css["deck-edit-sidebar-tabs-content"]}
            value="sideSlots"
          >
            <DecklistSection title="Side Deck">
              {deck.groups.side?.data ? (
                <DecklistGroups
                  canEdit
                  group={deck.groups.side.data}
                  layout="two_column"
                  quantities={deck.sideSlots ?? undefined}
                />
              ) : (
                "No cards"
              )}
            </DecklistSection>
          </TabsContent>
          {deck.hasExtraDeck && (
            <TabsContent
              className={css["deck-edit-sidebar-tabs-content"]}
              value="extraSlots"
            >
              <DecklistSection title="Side Deck">
                {deck.groups.extra?.data ? (
                  <DecklistGroups
                    canEdit
                    group={deck.groups.extra.data}
                    layout="one_column"
                    quantities={deck.extraSlots ?? undefined}
                  />
                ) : (
                  "No cards"
                )}
              </DecklistSection>
            </TabsContent>
          )}
          <TabsContent
            className={css["deck-edit-sidebar-tabs-content"]}
            value="meta"
          >
            <DeckEditMeta deck={deck} />
          </TabsContent>
        </Tabs>
      </Scroller>
    </div>
  );
}
