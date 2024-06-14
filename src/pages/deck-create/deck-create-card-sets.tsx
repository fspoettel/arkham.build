import { useCallback, useMemo } from "react";

import { CardSet } from "@/components/cardset";
import { useStore } from "@/store";
import {
  selectDeckCreateCardSets,
  selectDeckCreateInvestigator,
} from "@/store/selectors/deck-create";

import css from "./deck-create.module.css";

export function DeckCreateCardSets() {
  const onChangeCardQuantity = useStore(
    (state) => state.deckCreateChangeExtraCardQuantity,
  );

  const toggleConfigureCardSet = useStore(
    (state) => state.deckCreateToggleCardSet,
  );

  const investigator = useStore(selectDeckCreateInvestigator);

  const cardSets = useStore(selectDeckCreateCardSets);

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
      {cardSets.map((set) =>
        set.cards.length ? (
          <CardSet
            key={set.id}
            onChangeCardQuantity={onChangeCardQuantity}
            onSelect={handleCheckedChange}
            set={set}
          />
        ) : null,
      )}
    </div>
  );
}
