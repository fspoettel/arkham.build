import { DeckCard } from "@/components/deck-collection/deck-card";
import { DecklistGroups } from "@/components/decklist/decklist-groups";
import { DecklistSection } from "@/components/decklist/decklist-section";
import { DecklistValidation } from "@/components/decklist/decklist-validation";
import { Scroller } from "@/components/ui/scroller";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useStore } from "@/store";
import type { DisplayDeck } from "@/store/lib/deck-grouping";
import { selectCurrentTab } from "@/store/selectors/decks";

import css from "./deck-edit.module.css";

import { DeckEditInvestigator } from "./deck-edit-investigator";
import { DeckEditMeta } from "./deck-edit-meta";

type Props = {
  className?: string;
  deck: DisplayDeck;
};

function Placeholder({ name }: { name: string }) {
  return (
    <div className={css["deck-edit-sidebar-placeholder"]}>{name} is empty.</div>
  );
}

export function DeckEditSidebar({ deck }: Props) {
  const currentTab = useStore(selectCurrentTab);
  const updateActiveTab = useStore((state) => state.updateActiveTab);

  return (
    <div className={css["deck-edit-sidebar"]}>
      <DeckCard deck={deck} showThumbnail={false} showValidation />
      <DeckEditInvestigator deck={deck} />
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
            <TabsTrigger value="extraSlots">Spirits</TabsTrigger>
          )}
          <TabsTrigger value="meta">Meta</TabsTrigger>
        </TabsList>

        <Scroller className={css["deck-edit-sidebar-cards"]}>
          <TabsContent
            className={css["deck-edit-sidebar-tabs-content"]}
            value="slots"
          >
            <DecklistSection title="Cards">
              <DecklistGroups
                group={deck.groups.main.data}
                layout="two_column"
                mapping="slots"
                quantities={deck.slots}
              />
            </DecklistSection>
            <DecklistSection showTitle title="Special cards">
              <DecklistGroups
                group={deck.groups.special.data}
                layout="two_column"
                mapping="slots"
                quantities={deck.slots}
              />
            </DecklistSection>
            {deck.groups.bonded && deck.bondedSlots && (
              <DecklistSection showTitle title="Bonded cards">
                <DecklistGroups
                  group={deck.groups.bonded.data}
                  layout="two_column"
                  mapping="bonded"
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
                  group={deck.groups.side.data}
                  layout="two_column"
                  mapping="side"
                  quantities={deck.sideSlots ?? undefined}
                />
              ) : (
                <Placeholder name="Side deck" />
              )}
            </DecklistSection>
          </TabsContent>
          {deck.hasExtraDeck && (
            <TabsContent
              className={css["deck-edit-sidebar-tabs-content"]}
              value="extraSlots"
            >
              <DecklistSection title="Spirits">
                {deck.groups.extra?.data ? (
                  <DecklistGroups
                    group={deck.groups.extra.data}
                    layout="one_column"
                    mapping="extraSlots"
                    quantities={deck.extraSlots ?? undefined}
                  />
                ) : (
                  <Placeholder name="Spirit deck" />
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
        </Scroller>
        <DecklistValidation defaultOpen={false} />
      </Tabs>
    </div>
  );
}
