import clsx from "clsx";
import { useCallback } from "react";

import { useStore } from "@/store";
import type { ResolvedCard, ResolvedDeck } from "@/store/lib/types";
import type { Card } from "@/store/services/queries.types";
import type { CustomizationEdit } from "@/store/slices/deck-view.types";
import { getCardColor } from "@/utils/card-utils";

import css from "./card-customizations.module.css";

import { CustomizationOption } from "./customization-option";

type Props = {
  activeDeck: ResolvedDeck<ResolvedCard>;
  card: Card;
  canEdit?: boolean;
};

export function CardCustomizationsEdit({ activeDeck, card, canEdit }: Props) {
  const updateCustomization = useStore((state) => state.updateCustomization);
  const backgroundCls = getCardColor(card, "background");

  const choices = activeDeck.customizations?.[card.code];

  const options = card.customization_options;
  const text = card.real_customization_text?.split("\n");

  const onChangeCustomization = useCallback(
    (index: number, edit: CustomizationEdit) => {
      updateCustomization(card.code, index, edit);
    },
    [card.code, updateCustomization],
  );

  if (!options || !text) return null;

  const xpMax = options.reduce<number>(
    (acc, curr) => (curr.xp > acc ? curr.xp : acc),
    0,
  );

  return (
    <article className={css["customizations"]}>
      <header className={clsx(css["header"], backgroundCls)}>
        <h3 className={css["header-title"]}>Customizations</h3>
      </header>
      <div className={css["customizations-text"]}>
        {options.map((option, index) => (
          <CustomizationOption
            card={card}
            choices={choices}
            disabled={!canEdit}
            index={index}
            key={index}
            onChange={onChangeCustomization}
            option={option}
            text={text}
            xpMax={xpMax}
          />
        ))}
      </div>
    </article>
  );
}
