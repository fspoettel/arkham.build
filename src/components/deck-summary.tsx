import { cx } from "@/utils/cx";
import { CircleAlert, Copy, Pencil, Trash2 } from "lucide-react";
import { useCallback } from "react";
import { useLocation } from "wouter";

import type { DeckValidationResult } from "@/store/lib/deck-validation";
import type { ResolvedDeck } from "@/store/lib/types";
import { getCardColor } from "@/utils/card-utils";

import css from "./deck-summary.module.css";

import { CardThumbnail } from "./card/card-thumbnail";
import { Button } from "./ui/button";
import { DefaultTooltip } from "./ui/tooltip";

import {
  useDeleteDeck,
  useDuplicateDeck,
} from "../components/deck-display/hooks";

type Props = {
  children?: React.ReactNode;
  deck: ResolvedDeck;
  interactive?: boolean;
  showThumbnail?: boolean;
  validation?: DeckValidationResult | string | null;
};

export function DeckSummary(props: Props) {
  const { children, deck, interactive, showThumbnail, validation } = props;

  const [, setLocation] = useLocation();
  const duplicateDeck = useDuplicateDeck();
  const deleteDeck = useDeleteDeck();

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

  const onDuplicate = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    duplicateDeck(deck.id);
  };

  const onDelete = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    deleteDeck(deck.id);
  };

  const onEdit = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setLocation(`/deck/edit/${deck.id}`);
    },
    [deck.id, setLocation],
  );

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
            {!!validation &&
              (typeof validation === "string" || !validation?.valid) && (
                <div className={css["validation"]}>
                  <CircleAlert />
                </div>
              )}
          </div>
        )}
        <div className={css["header-container"]}>
          <div className={cx(css["info-container"], css["summary-transition"])}>
            <h3 className={css["title"]} data-testid="deck-summary-title">
              {deck.name}
            </h3>
            <div className={css["header-row"]}>
              <div className={css["header-row"]}>
                {card.parallel && (
                  <DefaultTooltip tooltip="Uses a parallel side">
                    <i className="icon-parallel" />
                  </DefaultTooltip>
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
                {!!deck.xp && (
                  <strong data-testid="deck-xp-earned">
                    <i className="icon-upgrade" />
                    {deck.xp + (deck.xp_adjustment ?? 0)} XP
                  </strong>
                )}
                <strong data-testid="deck-summary-size">
                  <i className="icon-card-outline-bold" />×{" "}
                  {deck.stats.deckSize} ({deck.stats.deckSizeTotal})
                </strong>
              </div>
            </div>
          </div>

          <nav
            className={cx(css["quick-actions-list"], css["summary-transition"])}
          >
            <Button
              className={css["quick-action"]}
              iconOnly
              tooltip="Edit"
              onClick={onEdit}
            >
              <Pencil />
            </Button>
            <Button
              className={css["quick-action"]}
              iconOnly
              tooltip="Duplicate"
              onClick={onDuplicate}
            >
              <Copy />
            </Button>
            <Button
              className={css["quick-action"]}
              iconOnly
              tooltip="Delete"
              onClick={onDelete}
            >
              <Trash2 />
            </Button>
          </nav>
        </div>
      </header>
      {children && <div className={css["meta"]}>{children}</div>}
    </article>
  );
}
