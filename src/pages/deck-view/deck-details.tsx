import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { useState } from "react";

import SvgCardOutlineBold from "@/assets/icons/card-outline-bold.svg?react";
import SvgName from "@/assets/icons/name.svg?react";
import SvgTaboo from "@/assets/icons/taboo.svg?react";
import SvgXp from "@/assets/icons/xp-bold.svg?react";
import { CardBack } from "@/components/card/card-back";
import { CardContainer } from "@/components/card/card-container";
import { CardFront } from "@/components/card/card-front";
import { FactionIcon } from "@/components/icons/faction-icon";
import { Button } from "@/components/ui/button";
import { Scroller } from "@/components/ui/scroll-area";
import type { DisplayDeck } from "@/store/lib/deck-grouping";
import { capitalize } from "@/utils/capitalize";

import css from "./deck-details.module.css";

type Props = {
  deck: DisplayDeck;
};

export function DeckDetails({ deck }: Props) {
  const [backToggled, toggleBack] = useState(false);

  return (
    <Scroller>
      <CardContainer size="tooltip">
        <CardFront
          resolvedCard={deck.investigatorFront}
          size="tooltip"
          linked
        />
        <div
          className={clsx(
            css["deck-detail-back-toggle"],
            backToggled && css["open"],
          )}
        >
          <Button onClick={() => toggleBack((p) => !p)}>
            {backToggled ? <ChevronUpIcon /> : <ChevronDownIcon />}
            Backside{" "}
            {deck.investigatorBack.card.parallel && (
              <>
                (<span className="encounters-parallel" />)
              </>
            )}
          </Button>
        </div>
        {backToggled && (
          <CardBack card={deck.investigatorBack.card} size="tooltip" />
        )}
      </CardContainer>

      <div className={css["deck-details-container"]}>
        <ul className={css["deck-details"]}>
          <li className={clsx(css["detail"], css["full"])}>
            <div className={css["detail-label"]}>
              <SvgName /> Title
            </div>
            <h1 className={css["detail-value"]}>{deck.name}</h1>
          </li>

          <li className={css["detail"]}>
            <div className={css["detail-label"]}>
              <SvgCardOutlineBold /> Deck size
            </div>
            <p className={css["detail-value"]}>
              {deck.stats.deckSize} ({deck.stats.deckSizeTotal} total)
            </p>
          </li>

          <li className={css["detail"]}>
            <div className={css["detail-label"]}>
              <SvgXp /> XP required
            </div>
            <p className={css["detail-value"]}>{deck.stats.xpRequired}</p>
          </li>

          <li className={css["detail"]}>
            <div className={css["detail-label"]}>
              <SvgTaboo /> Taboo
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

          {deck.factionSelect && (
            <li className={clsx(css["detail"], css["full"])}>
              <div className={css["detail-label"]}>
                <SvgCardOutlineBold /> Secondary class choice
              </div>
              <p className={css["detail-value"]}>
                {deck.factionSelect.selection && (
                  <FactionIcon code={deck.factionSelect.selection} />
                )}
                {deck.factionSelect.selection
                  ? capitalize(deck.factionSelect.selection)
                  : "None"}
              </p>
            </li>
          )}

          {deck.optionSelect && (
            <li className={clsx(css["detail"], css["full"])}>
              <div className={css["detail-label"]}>
                <SvgCardOutlineBold /> {deck.optionSelect.name}
              </div>
              <p className={css["detail-value"]}>
                {deck.optionSelect.selection
                  ? capitalize(deck.optionSelect.selection)
                  : "None"}
              </p>
            </li>
          )}
        </ul>
      </div>
    </Scroller>
  );
}
