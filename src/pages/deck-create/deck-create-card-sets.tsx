import clsx from "clsx";
import { useCallback, useMemo } from "react";

import { ListCard } from "@/components/list-card/list-card";
import { Checkbox } from "@/components/ui/checkbox";
import { useStore } from "@/store";
import {
  selectCardOwnedCount,
  selectDeckCreateCardSets,
  selectDeckCreateChecked,
  selectDeckCreateInvestigator,
} from "@/store/selectors/deck-create";

import css from "./deck-create.module.css";

export function DeckCreateCardSets() {
  const randomBasicWeakness = useStore(
    (state) => state.metadata.cards["01000"],
  );

  const onChangeCardQuantity = useStore(
    (state) => state.deckCreateChangeExtraCardQuantity,
  );

  const toggleConfigureCardSet = useStore(
    (state) => state.deckCreateToggleCardSet,
  );

  const deckCreate = useStore(selectDeckCreateChecked);
  const investigator = useStore(selectDeckCreateInvestigator);

  const cardOwnedCount = useStore(selectCardOwnedCount);
  const cardSets = useStore(selectDeckCreateCardSets);

  const canChooseSets = cardSets.some(
    (set) => set.id === "advanced" || set.id === "replacement",
  );

  const handleCheckedChange = useCallback(
    (id: string) => {
      toggleConfigureCardSet(id);
    },
    [toggleConfigureCardSet],
  );

  const cssVariables = useMemo(
    () =>
      ({
        "--accent-color": `var(--${investigator.card.faction_code})`,
      }) as React.CSSProperties,
    [investigator],
  );

  return (
    <div className={css["card-selections"]} style={cssVariables}>
      <CardSet
        id="random_basic_weakness"
        selections={["random_basic_weakness"]}
        title="Random basic weakness"
      >
        <ListCard
          card={randomBasicWeakness}
          omitBorders
          quantities={{ [randomBasicWeakness.code]: 1 }}
        />
      </CardSet>

      {cardSets.map((set) =>
        set.cards.length ? (
          <CardSet
            id={set.id}
            key={set.id}
            onCheckedChange={
              !set.static && canChooseSets ? handleCheckedChange : undefined
            }
            selections={set.static ? [set.id] : deckCreate.sets}
            title={set.title}
          >
            {set.cards.map(({ card }) => (
              <ListCard
                card={card}
                key={card.code}
                omitBorders
                onChangeCardQuantity={
                  set.quantitiesSettable ? onChangeCardQuantity : undefined
                }
                owned={cardOwnedCount(card)}
                quantities={{ [card.code]: set.quantities[card.code] }}
              />
            ))}
          </CardSet>
        ) : null,
      )}
    </div>
  );
}

type GroupProps = {
  children: React.ReactNode;
  id: string;
  onCheckedChange?: (id: string) => void;
  selections: string[];
  title: string;
};

function CardSet({
  children,
  id,
  onCheckedChange,
  selections,
  title,
}: GroupProps) {
  const selected = selections.includes(id);

  const onSelect = useCallback(() => {
    onCheckedChange?.(id);
  }, [id, onCheckedChange]);

  return (
    <article
      className={clsx(css["group"], selected && css["selected"])}
      id={id}
    >
      <header className={css["group-header"]}>
        <Checkbox
          checked={selected}
          className={css["group-title"]}
          disabled={!onSelect}
          id={`card-set-${id}`}
          label={title}
          onCheckedChange={onSelect}
        />
      </header>
      <div className={css["group-cards"]}>{children}</div>
    </article>
  );
}
