import clsx from "clsx";
import { useCallback } from "react";

import { useStore } from "@/store";
import type { ResolvedCard, ResolvedDeck } from "@/store/lib/types";
import type { Card } from "@/store/services/queries.types";
import type { CustomizationEdit } from "@/store/slices/deck-edits.types";
import { getCardColor } from "@/utils/card-utils";
import { useDeckId } from "@/utils/use-deck-id";

import css from "./customizations.module.css";

import { CustomizationOption } from "./customization-option";

type Props = {
  deck?: ResolvedDeck<ResolvedCard>;
  card: Card;
  canEdit?: boolean;
};

export function CustomizationsEditor(props: Props) {
  const { deck, card, canEdit } = props;

  const deckIdCtx = useDeckId();
  const updateCustomization = useStore((state) => state.updateCustomization);
  const backgroundCls = getCardColor(card, "background");

  const choices = deck?.customizations?.[card.code];

  const options = card.customization_options;
  const text = card.real_customization_text?.split("\n");

  const onChangeCustomization = useCallback(
    (index: number, edit: CustomizationEdit) => {
      if (!deckIdCtx.deckId) return;
      updateCustomization(deckIdCtx.deckId, card.code, index, edit);
    },
    [card.code, updateCustomization, deckIdCtx.deckId],
  );

  if (!options || !text) return null;

  const xpMax = options.reduce<number>(
    (acc, curr) => (curr.xp > acc ? curr.xp : acc),
    0,
  );

  return (
    <article className={css["customizations"]}>
      <header className={clsx(css["header"], backgroundCls)}>
        <h3>Customizations</h3>
      </header>
      <div className={css["text"]}>
        {options.map((option, i) => (
          <CustomizationOption
            card={card}
            choices={choices}
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
