import clsx from "clsx";
import { CircleAlert } from "lucide-react";
import type { ReactNode } from "react";

import { useStore } from "@/store";
import { validateDeck } from "@/store/lib/deck-validation";
import type { ResolvedCard, ResolvedDeck } from "@/store/lib/types";
import type { StoreState } from "@/store/slices";
import { getCardColor } from "@/utils/card-utils";

import css from "./deck-card.module.css";

import { CardThumbnail } from "../card/card-thumbnail";

type Props = {
  children?: ReactNode;
  deck: ResolvedDeck<ResolvedCard>;
  interactive?: boolean;
  showThumbnail?: boolean;
  showValidation?: boolean;
  showVersion?: boolean;
};

export function DeckCard({
  children,
  deck,
  interactive,
  showThumbnail,
  showValidation,
  showVersion,
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
        css["deck"],
        borderCls,
        interactive && css["interactive"],
      )}
    >
      <header className={clsx(css["deck-header"], backgroundCls)}>
        {showThumbnail && (
          <div className={css["deck-thumbnail"]}>
            <CardThumbnail card={deck.cards.investigator.card} />
          </div>
        )}
        <div className={css["deck-header-container"]}>
          <h3 className={css["deck-title"]}>
            {showValidation && validationResult && !validationResult.valid && (
              <CircleAlert />
            )}
            {deck.name}
            {showVersion ? ` v${deck.version}` : ""}
          </h3>
          <div className={css["deck-header-row"]}>
            <h4 className={css["deck-sub"]}>
              {deck.cards.investigator.card.real_name}
            </h4>
            <div className={css["deck-stats"]}>
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

      {children && <div className={css["deck-meta"]}>{children}</div>}
    </article>
  );
}
