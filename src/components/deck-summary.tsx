import clsx from "clsx";
import { CircleAlert } from "lucide-react";

import type { DeckValidationResult } from "@/store/lib/deck-validation";
import type { ResolvedCard, ResolvedDeck } from "@/store/lib/types";
import { getCardColor } from "@/utils/card-utils";

import css from "./deck-summary.module.css";

import { CardThumbnail } from "./card/card-thumbnail";

type Props = {
  children?: React.ReactNode;
  deck: ResolvedDeck<ResolvedCard>;
  interactive?: boolean;
  showThumbnail?: boolean;
  validation?: DeckValidationResult;
};

export function DeckSummary(props: Props) {
  const backgroundCls = getCardColor(
    props.deck.cards.investigator.card,
    "background",
  );

  const borderCls = getCardColor(props.deck.cards.investigator.card, "border");

  const showValidation = !!props.validation;

  return (
    <article
      className={clsx(
        css["summary"],
        borderCls,
        props.interactive && css["interactive"],
      )}
    >
      <header className={clsx(css["header"], backgroundCls)}>
        {props.showThumbnail && (
          <div className={css["thumbnail"]}>
            <CardThumbnail card={props.deck.cards.investigator.card} />
          </div>
        )}
        <div className={css["header-container"]}>
          <h3 className={css["title"]} data-testid="deck-summary-title">
            {showValidation && !props.validation?.valid && <CircleAlert />}
            {props.deck.name}
          </h3>
          <div className={css["header-row"]}>
            <h4 className={css["sub"]} data-testid="deck-summary-investigator">
              {props.deck.cards.investigator.card.real_name}
            </h4>
            <div className={css["stats"]}>
              <strong data-testid="deck-summary-xp">
                <i className="icon-xp-bold" />
                {props.deck.stats.xpRequired} XP
              </strong>
              <strong data-testid="deck-summary-size">
                <i className="icon-card-outline-bold" />×{" "}
                {props.deck.stats.deckSize} ({props.deck.stats.deckSizeTotal})
              </strong>
            </div>
          </div>
        </div>
      </header>

      {props.children && <div className={css["meta"]}>{props.children}</div>}
    </article>
  );
}
