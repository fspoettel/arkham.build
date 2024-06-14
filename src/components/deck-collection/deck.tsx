import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import clsx from "clsx";

import SvgCardOutline from "@/assets/icons/card-outline-bold.svg?react";
import SvgXpBold from "@/assets/icons/xp-bold.svg?react";
import { useStore } from "@/store";
import { validateDeck } from "@/store/lib/deck-validation";
import type { ResolvedCard, ResolvedDeck } from "@/store/lib/types";
import type { StoreState } from "@/store/slices";
import { capitalize } from "@/utils/capitalize";
import { getCardColor } from "@/utils/card-utils";

import css from "./deck.module.css";

import { CardThumbnail } from "../card/card-thumbnail";

type Props = {
  interactive?: boolean;
  deck: ResolvedDeck<ResolvedCard>;
};

export function DeckCard({ deck, interactive }: Props) {
  const lookupTables = useStore((state: StoreState) => state.lookupTables);
  const metadata = useStore((state: StoreState) => state.metadata);
  const { valid } = validateDeck(deck, {
    lookupTables,
    metadata,
  } as StoreState);

  const backgroundCls = getCardColor(
    deck.cards.investigator.card,
    "background",
  );

  const borderCls = getCardColor(deck.cards.investigator.card, "border");

  return (
    <article
      className={clsx(
        css["deck"],
        borderCls,
        interactive && css["interactive"],
      )}
    >
      <header className={clsx(css["deck-header"], backgroundCls)}>
        <div className={css["deck-thumbnail"]}>
          <CardThumbnail card={deck.cards.investigator.card} />
        </div>
        <div className={css["deck-header-container"]}>
          <h3 className={css["deck-title"]}>
            {!valid && <ExclamationTriangleIcon />}
            {deck.name}
          </h3>
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
                <SvgCardOutline />× {deck.stats.deckSize} (
                {deck.stats.deckSizeTotal})
              </strong>
            </div>
          </div>
        </div>
      </header>

      {false && deck.tags && (
        <div className={css["deck-meta"]}>
          {deck.tags.split(" ").map((s) => capitalize(s))}
        </div>
      )}
    </article>
  );
}
