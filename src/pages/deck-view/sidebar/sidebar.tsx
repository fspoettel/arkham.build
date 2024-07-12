import clsx from "clsx";

import { DeckInvestigator } from "@/components/deck-investigator";
import { FactionIcon } from "@/components/icons/faction-icon";
import type { DisplayDeck } from "@/store/lib/deck-grouping";
import { capitalize, formatSelectionId } from "@/utils/formatting";

import css from "./sidebar.module.css";

import { SidebarActions } from "./sidebar-actions";

type Props = {
  className?: string;
  deck: DisplayDeck;
};

export function Sidebar(props: Props) {
  return (
    <div className={clsx(css["container"], props.className)}>
      <DeckInvestigator deck={props.deck} size="tooltip" />
      <SidebarActions deck={props.deck} />

      <ul className={css["details"]}>
        <li className={css["detail"]} data-testid="view-deck-size">
          <div className={css["detail-label"]}>
            <i className="icon-card-outline-bold" /> Deck size
          </div>
          <p className={css["detail-value"]}>
            {props.deck.stats.deckSize} ({props.deck.stats.deckSizeTotal} total)
          </p>
        </li>

        <li className={css["detail"]} data-testid="view-deck-xp">
          <div className={css["detail-label"]}>
            <i className="icon-xp-bold" /> XP required
          </div>
          <p className={css["detail-value"]}>{props.deck.stats.xpRequired}</p>
        </li>

        <li className={css["detail"]} data-testid="view-deck-taboo">
          <div className={css["detail-label"]}>
            <i className="icon-taboo" /> Taboo
          </div>
          <p className={css["detail-value"]}>
            {props.deck.tabooSet ? (
              <span>
                {props.deck.tabooSet.name} -{" "}
                {props.deck.tabooSet.date.slice(0, 4)}
              </span>
            ) : (
              "None"
            )}
          </p>
        </li>

        {!!props.deck.selections &&
          Object.entries(props.deck.selections).map(([key, selection]) => (
            <li className={css["detail"]} key={key}>
              <div className={css["detail-label"]}>
                {formatSelectionId(key)}
              </div>
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
