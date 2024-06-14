import { Pencil2Icon, TrashIcon } from "@radix-ui/react-icons";
import clsx from "clsx";
import { useCallback } from "react";
import { Link, useLocation } from "wouter";

import SvgCardOutlineBold from "@/assets/icons/card-outline-bold.svg?react";
import SvgTaboo from "@/assets/icons/taboo.svg?react";
import SvgXp from "@/assets/icons/xp-bold.svg?react";
import { DeckInvestigator } from "@/components/deck-investigator/deck-investigator";
import { FactionIcon } from "@/components/icons/faction-icon";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store";
import type { DisplayDeck } from "@/store/lib/deck-grouping";
import { capitalize } from "@/utils/capitalize";

import css from "./deck-sidebar.module.css";

type Props = {
  className?: string;
  deck: DisplayDeck;
};

export function DeckSidebar({ className, deck }: Props) {
  const deleteDeck = useStore((state) => state.deleteDeck);
  const [, setLocation] = useLocation();

  const onDelete = useCallback(() => {
    deleteDeck(deck.id);
    setLocation("~/browse");
  }, [deck.id, deleteDeck, setLocation]);

  return (
    <div className={clsx(css["deck-sidebar"], className)}>
      <DeckInvestigator deck={deck} />
      <div className={css["deck-sidebar-actions"]}>
        <Link asChild href={`/${deck.id}/edit`}>
          <Button as="a" size="full">
            <Pencil2Icon /> Edit
          </Button>
        </Link>

        <Button size="full" onClick={onDelete}>
          <TrashIcon /> Delete
        </Button>
      </div>

      <div className={css["deck-sidebar-details"]}>
        <ul className={css["deck-details"]}>
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
                <SvgCardOutlineBold /> Secondary class choice(s)
              </div>
              <p className={css["detail-value"]}>
                {deck.factionSelect.selections?.length
                  ? deck.factionSelect.selections?.map((selection) =>
                      selection ? (
                        <span key={selection}>
                          <FactionIcon code={selection} />
                          {capitalize(selection)}
                        </span>
                      ) : (
                        "None"
                      ),
                    )
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
    </div>
  );
}
