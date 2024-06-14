import clsx from "clsx";
import { CircleAlert } from "lucide-react";

import { useStore } from "@/store";
import { validateDeck } from "@/store/lib/deck-validation";
import type { ResolvedCard, ResolvedDeck } from "@/store/lib/types";
import type { StoreState } from "@/store/slices";
import { getCardColor } from "@/utils/card-utils";

import css from "./deck-summary.module.css";

import { CardThumbnail } from "./card/card-thumbnail";

type Props = {
  children?: React.ReactNode;
  deck: ResolvedDeck<ResolvedCard>;
  interactive?: boolean;
  showThumbnail?: boolean;
  showValidation?: boolean;
};

export function DeckSummary({
  children,
  deck,
  interactive,
  showThumbnail,
  showValidation,
}: Props) {
  const lookupTables = useStore((state: StoreState) => state.lookupTables);
  const metadata = useStore((state: StoreState) => state.metadata);

  const validationResult = showValidation
    ? validateDeck(deck, {
        lookupTables,
        metadata,
      } as StoreState)
    : undefined;

  const backgroundCls = getCardColor(
    deck.cards.investigator.card,
    "background",
  );

  const borderCls = getCardColor(deck.cards.investigator.card, "border");

  return (
    <article
      className={clsx(
        css["summary"],
        borderCls,
        interactive && css["interactive"],
      )}
    >
      <header className={clsx(css["header"], backgroundCls)}>
        {showThumbnail && (
          <div className={css["thumbnail"]}>
            <CardThumbnail card={deck.cards.investigator.card} />
          </div>
        )}
        <div className={css["header-container"]}>
          <h3 className={css["title"]}>
            {showValidation && validationResult && !validationResult.valid && (
              <CircleAlert />
            )}
            {deck.name}
          </h3>
          <div className={css["header-row"]}>
            <h4 className={css["sub"]}>
              {deck.cards.investigator.card.real_name}
            </h4>
            <div className={css["stats"]}>
              <strong>
                <i className="icon-xp-bold" />
                {deck.stats.xpRequired} XP
              </strong>
              <strong>
                <i className="icon-card-outline-bold" />× {deck.stats.deckSize}{" "}
                ({deck.stats.deckSizeTotal})
              </strong>
            </div>
          </div>
        </div>
      </header>

      {children && <div className={css["meta"]}>{children}</div>}
    </article>
  );
}
