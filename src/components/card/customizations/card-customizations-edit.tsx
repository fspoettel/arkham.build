import clsx from "clsx";

import type { ResolvedCard, ResolvedDeck } from "@/store/lib/types";
import type { Card } from "@/store/services/types";
import { getCardColor } from "@/utils/card-utils";

import css from "./card-customizations.module.css";

import { CustomizationOption } from "./customization-option";

type Props = {
  activeDeck: ResolvedDeck<ResolvedCard>;
  card: Card;
  disabled?: boolean;
};

export function CardCustomizationsEdit({ activeDeck, card }: Props) {
  const backgroundCls = getCardColor(card, "background");

  const choices = activeDeck.customizations?.[card.code];

  const options = card.customization_options;
  const text = card.real_customization_text?.split("\n");

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
            key={index}
            option={option}
            index={index}
            choices={choices}
            text={text}
            xpMax={xpMax}
          />
        ))}
      </div>
    </article>
  );
}
