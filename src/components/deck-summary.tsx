import { cx } from "@/utils/cx";
import { CircleAlert } from "lucide-react";

import type { DeckValidationResult } from "@/store/lib/deck-validation";
import type { ResolvedDeck } from "@/store/lib/types";
import { getCardColor } from "@/utils/card-utils";

import css from "./deck-summary.module.css";

import { CardThumbnail } from "./card/card-thumbnail";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  children?: React.ReactNode;
  deck: ResolvedDeck;
  interactive?: boolean;
  showThumbnail?: boolean;
  validation?: DeckValidationResult | string | null;
};

export function DeckSummary(props: Props) {
  const { children, deck, interactive, showThumbnail, validation } = props;

  const backgroundCls = getCardColor(
    deck.cards.investigator.card,
    "background",
  );

  const borderCls = getCardColor(deck.cards.investigator.card, "border");

  const card = {
    ...deck.investigatorFront.card,
    parallel:
      deck.investigatorFront.card.parallel ||
      deck.investigatorBack.card.parallel,
  };

  return (
    <article
      className={cx(
        css["summary"],
        borderCls,
        interactive && css["interactive"],
      )}
    >
      <header className={cx(css["header"], backgroundCls)}>
        {showThumbnail && (
          <div className={css["thumbnail"]}>
            <CardThumbnail card={card} />
          </div>
        )}
        <div className={css["header-container"]}>
          <h3 className={css["title"]} data-testid="deck-summary-title">
            {!!validation &&
              (typeof validation === "string" || !validation?.valid) && (
                <CircleAlert />
              )}
            {deck.name}
          </h3>
          <div className={css["header-row"]}>
            <div className={css["header-row"]}>
              {card.parallel && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <i className="icon-parallel" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Uses a parallel side</p>
                  </TooltipContent>
                </Tooltip>
              )}
              <h4
                className={css["sub"]}
                data-testid="deck-summary-investigator"
              >
                {card.real_name}
              </h4>
            </div>
            <div className={css["stats"]}>
              <strong data-testid="deck-summary-xp">
                <i className="icon-xp-bold" />
                {deck.stats.xpRequired} XP
              </strong>
              <strong data-testid="deck-summary-size">
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
