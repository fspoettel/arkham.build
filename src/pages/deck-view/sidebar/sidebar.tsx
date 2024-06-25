import clsx from "clsx";

import { DeckInvestigator } from "@/components/deck-investigator";
import { FactionIcon } from "@/components/icons/faction-icon";
import type { DisplayDeck } from "@/store/lib/deck-grouping";
import { capitalize } from "@/utils/formatting";

import css from "./sidebar.module.css";

import { SidebarActions } from "./sidebar-actions";

type Props = {
  className?: string;
  deck: DisplayDeck;
};

export function Sidebar({ className, deck }: Props) {
  return (
    <div className={clsx(css["container"], className)}>
      <DeckInvestigator deck={deck} size="tooltip" />
      <SidebarActions deck={deck} />

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
              <span>
                {deck.tabooSet.name} - {deck.tabooSet.date.slice(0, 4)}
              </span>
            ) : (
              "None"
            )}
          </p>
        </li>

        {!!deck.selections &&
          Object.entries(deck.selections).map(([key, selection]) => (
            <li className={css["detail"]} key={key}>
              <div className={css["detail-label"]}>{capitalize(key)}</div>
              {selection.type === "deckSize" && (
                <p className={css["detail-value"]}>{selection.value}</p>
              )}
              {selection.type === "faction" && (
                <p className={css["detail-value"]}>
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
                <p className={css["detail-value"]}>
                  {selection.value?.name ?? "None"}
                </p>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
}
