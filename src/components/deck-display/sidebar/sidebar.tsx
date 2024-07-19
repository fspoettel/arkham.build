import { DeckInvestigator } from "@/components/deck-investigator";
import { FactionIcon } from "@/components/icons/faction-icon";
import {
  capitalize,
  formatSelectionId,
  formatTabooSet,
} from "@/utils/formatting";

import css from "./sidebar.module.css";

import { Button } from "@/components/ui/button";
import type { ResolvedDeck } from "@/store/lib/types";
import { cx } from "@/utils/cx";
import { Import } from "lucide-react";
import { Sharing } from "./sharing";
import { SidebarActions } from "./sidebar-actions";

type Props = {
  className?: string;
  deck: ResolvedDeck;
  owned?: boolean;
};

export function Sidebar(props: Props) {
  const { className, deck, owned } = props;

  return (
    <div className={cx(css["container"], className)}>
      <DeckInvestigator deck={deck} size="tooltip" />
      {owned ? (
        <SidebarActions deck={deck} />
      ) : (
        <Button size="full">
          <Import /> Import deck to collection
        </Button>
      )}
      <ul className={css["details"]}>
        <li className={css["detail"]} data-testid="view-deck-size">
          <div className={css["detail-label"]}>
            <i className="icon-card-outline-bold" /> Deck size
          </div>
          <p className={css["detail-value"]}>
            {deck.stats.deckSize} ({deck.stats.deckSizeTotal} total)
          </p>
        </li>

        <li className={css["detail"]} data-testid="view-deck-xp">
          <div className={css["detail-label"]}>
            <i className="icon-xp-bold" /> XP required
          </div>
          <p className={css["detail-value"]}>{deck.stats.xpRequired}</p>
        </li>

        <li className={css["detail"]} data-testid="view-deck-taboo">
          <div className={css["detail-label"]}>
            <i className="icon-taboo" /> Taboo
          </div>
          <p className={css["detail-value"]}>
            {deck.tabooSet ? (
              <span>{formatTabooSet(deck.tabooSet)}</span>
            ) : (
              "None"
            )}
          </p>
        </li>

        {!!deck.selections &&
          Object.entries(deck.selections).map(([key, selection]) => (
            <li
              className={css["detail"]}
              key={key}
              data-testid={`selection-${key}`}
            >
              <div
                className={css["detail-label"]}
                data-testid={`selection-${key}-label`}
              >
                {formatSelectionId(key)}
              </div>
              {selection.type === "deckSize" && (
                <p
                  className={css["detail-value"]}
                  data-testid={`selection-${key}-value`}
                >
                  {selection.value}
                </p>
              )}
              {selection.type === "faction" && (
                <p
                  className={css["detail-value"]}
                  data-testid={`selection-${key}-value`}
                >
                  {selection.value ? (
                    <>
                      <FactionIcon code={selection.value} />
                      {capitalize(selection.value)}
                    </>
                  ) : (
                    "None"
                  )}
                </p>
              )}
              {selection.type === "option" && (
                <p
                  className={css["detail-value"]}
                  data-testid={`selection-${key}-value`}
                >
                  {selection.value?.name ?? "None"}
                </p>
              )}
            </li>
          ))}
      </ul>

      {owned && <Sharing deck={deck} />}
    </div>
  );
}
