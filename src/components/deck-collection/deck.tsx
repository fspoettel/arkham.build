import clsx from "clsx";

import SvgCardOutline from "@/assets/icons/card-outline-bold.svg?react";
import SvgXpBold from "@/assets/icons/xp-bold.svg?react";
import type { CardResolved } from "@/store/utils/card-resolver";
import type { ResolvedDeck } from "@/store/utils/deck-resolver";
import { capitalize } from "@/utils/capitalize";
import { getCardColor } from "@/utils/card-utils";

import css from "./deck.module.css";

import { CardThumbnail } from "../card/card-thumbnail";

type Props = {
  deck: ResolvedDeck<CardResolved>;
};

export function Deck({ deck }: Props) {
  const backgroundCls = getCardColor(
    deck.cards.investigator.card,
    "background",
  );
  const borderCls = getCardColor(deck.cards.investigator.card, "border");

  return (
    <article className={clsx(css["deck"], borderCls)}>
      <header className={clsx(css["deck-header"], backgroundCls)}>
        <div className={css["deck-thumbnail"]}>
          <CardThumbnail card={deck.cards.investigator.card} />
        </div>
        <div className={css["deck-header-container"]}>
          <h3 className={css["deck-title"]}>{deck.name}</h3>
          <div className={css["deck-header-row"]}>
            <h4 className={css["deck-sub"]}>
              {deck.cards.investigator.card.real_name}
            </h4>
            <div className={css["deck-stats"]}>
              <strong>
                <SvgXpBold />
                {deck.stats.xpRequired} XP
              </strong>
              <strong>
                <SvgCardOutline />× {deck.stats.deckSizeTotal}
              </strong>
            </div>
          </div>
        </div>
      </header>

      {deck.tags && (
        <div className={css["deck-meta"]}>
          {deck.tags.split(" ").map((s) => capitalize(s))}
        </div>
      )}
    </article>
  );
}
