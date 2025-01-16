import { useStore } from "@/store";
import { type DeckGrouping, countGroupRows } from "@/store/lib/deck-grouping";
import type { ResolvedDeck } from "@/store/lib/types";
import { selectDeckGroups } from "@/store/selectors/decks";
import type { Card } from "@/store/services/queries.types";
import { useCallback } from "react";
import { Attachments } from "../attachments/attachments";
import { DecklistGroup } from "./decklist-groups";
import { DecklistSection } from "./decklist-section";
import css from "./decklist.module.css";

const LABELS: Record<string, string> = {
  slots: "Cards",
  sideSlots: "Side deck",
  bondedSlots: "Bonded cards",
  extraSlots: "Extra deck",
};

type Props = {
  deck: ResolvedDeck;
};

export function Decklist(props: Props) {
  const { deck } = props;

  const groups = useStore((state) => selectDeckGroups(state, deck));

  const renderCardExtra = useCallback(
    (card: Card) => <Attachments card={card} resolvedDeck={deck} />,
    [deck],
  );

  const getListCardProps = useCallback(
    () => ({ renderCardExtra }),
    [renderCardExtra],
  );

  const hasAdditional =
    groups.bondedSlots || groups.extraSlots || groups.sideSlots;

  return (
    <article className={css["decklist-container"]} data-testid="view-decklist">
      <div className={css["decklist"]}>
        {groups.slots && (
          <DecklistSection title={LABELS["main"]}>
            <DecklistGroup
              deck={deck}
              grouping={groups.slots}
              getListCardProps={getListCardProps}
            />
          </DecklistSection>
        )}

        {hasAdditional && (
          <div className={css["decklist-additional"]}>
            {groups.sideSlots && (
              <DecklistSection
                columns={getColumnMode(groups.sideSlots)}
                showTitle
                title={LABELS["sideSlots"]}
              >
                <DecklistGroup
                  deck={deck}
                  grouping={groups.sideSlots}
                  getListCardProps={getListCardProps}
                />
              </DecklistSection>
            )}
            {groups.bondedSlots && (
              <DecklistSection
                columns={getColumnMode(groups.bondedSlots)}
                title={LABELS["bondedSlots"]}
                showTitle
              >
                <DecklistGroup
                  deck={deck}
                  grouping={groups.bondedSlots}
                  getListCardProps={getListCardProps}
                />
              </DecklistSection>
            )}

            {groups.extraSlots && (
              <DecklistSection
                columns={getColumnMode(groups.extraSlots)}
                title={LABELS["extraSlots"]}
                showTitle
              >
                <DecklistGroup
                  deck={deck}
                  grouping={groups.extraSlots}
                  getListCardProps={getListCardProps}
                />
              </DecklistSection>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function getColumnMode(group: DeckGrouping) {
  return countGroupRows(group) < 5 ? "single" : "auto";
}
