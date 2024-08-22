import { cx } from "@/utils/cx";
import { useCallback } from "react";

import { useStore } from "@/store";
import type { ResolvedDeck } from "@/store/lib/types";
import type { Card } from "@/store/services/queries.types";
import type { CustomizationEdit } from "@/store/slices/deck-edits.types";
import { getCardColor } from "@/utils/card-utils";

import css from "./customizations.module.css";

import { CustomizationOption } from "./customization-option";

type Props = {
  deck?: ResolvedDeck;
  card: Card;
  canEdit?: boolean;
};

export function CustomizationsEditor(props: Props) {
  const { deck, card, canEdit } = props;

  const updateCustomization = useStore((state) => state.updateCustomization);
  const backgroundCls = getCardColor(card, "background");

  const choices = deck?.customizations?.[card.code];

  const options = card.customization_options;
  const text = card.real_customization_text?.split("\n");

  const onChangeCustomization = useCallback(
    (index: number, edit: CustomizationEdit) => {
      if (!deck) return;
      updateCustomization(deck.id, card.code, index, edit);
    },
    [card.code, updateCustomization, deck],
  );

  if (!options || !text) return null;

  const xpMax = options.reduce<number>(
    (acc, curr) => (curr.xp > acc ? curr.xp : acc),
    0,
  );

  return (
    <article
      className={css["customizations"]}
      data-testid="customizations-editor"
    >
      <header className={cx(css["header"], backgroundCls)}>
        <h3>Customizations</h3>
      </header>
      <div className={css["text"]}>
        {options.map((option, i) => (
          <CustomizationOption
            card={card}
            choice={choices?.[i]}
            disabled={!canEdit}
            index={i}
            // biome-ignore lint/suspicious/noArrayIndexKey: order is stable.
            key={i}
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
