import { useCallback } from "react";

import { useCardModalContext } from "@/components/card-modal/card-modal-context";
import { CardSet } from "@/components/cardset";
import { useStore } from "@/store";
import {
  selectDeckCreateCardSets,
  selectDeckCreateInvestigator,
} from "@/store/selectors/deck-create";

import css from "./deck-create.module.css";

import { useAccentColor } from "../../utils/use-accent-color";

export function DeckCreateCardSets() {
  const modalContext = useCardModalContext();

  const onChangeCardQuantity = useStore(
    (state) => state.deckCreateChangeExtraCardQuantity,
  );

  const toggleConfigureCardSet = useStore(
    (state) => state.deckCreateToggleCardSet,
  );

  const cardSets = useStore(selectDeckCreateCardSets);

  const handleCheckedChange = useCallback(
    (id: string) => {
      toggleConfigureCardSet(id);
    },
    [toggleConfigureCardSet],
  );

  const investigator = useStore(selectDeckCreateInvestigator);
  const cssVariables = useAccentColor(investigator.card.faction_code);

  const onOpenModal = useCallback(
    (code: string) => {
      modalContext.setOpen({ code });
    },
    [modalContext],
  );

  return (
    <div className={css["card-selections"]} style={cssVariables}>
      {cardSets.map((set) =>
        set.cards.length ? (
          <CardSet
            key={set.id}
            onChangeCardQuantity={onChangeCardQuantity}
            onOpenModal={onOpenModal}
            onSelect={handleCheckedChange}
            set={set}
          />
        ) : null,
      )}
    </div>
  );
}
