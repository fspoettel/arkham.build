import { DeckInvestigator } from "@/components/deck-investigator";
import { FactionIcon } from "@/components/icons/faction-icon";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast.hooks";
import { useStore } from "@/store";
import type { ResolvedDeck } from "@/store/lib/types";
import { cx } from "@/utils/cx";
import {
  capitalize,
  capitalizeSnakeCase,
  formatTabooSet,
} from "@/utils/formatting";
import { ImportIcon } from "lucide-react";
import { useCallback } from "react";
import { useLocation } from "wouter";
import { LatestUpgrade } from "../deck-history/latest-upgrade";
import { Sharing } from "./sharing";
import { SidebarActions } from "./sidebar-actions";
import css from "./sidebar.module.css";

type Props = {
  className?: string;
  deck: ResolvedDeck;
  owned?: boolean;
};

export function Sidebar(props: Props) {
  const { className, deck, owned } = props;

  const [, navigate] = useLocation();
  const toast = useToast();
  const importSharedDeck = useStore((state) => state.importSharedDeck);

  const onImport = useCallback(() => {
    try {
      const id = importSharedDeck(deck);
      toast.show({
        children: "Deck import successful.",
        variant: "success",
        duration: 3000,
      });

      navigate(`/deck/view/${id}`);
    } catch (err) {
      toast.show({
        children: `Failed to import deck: ${(err as Error).message}`,
        variant: "error",
      });
    }
  }, [deck, importSharedDeck, toast.show, navigate]);

  return (
    <div className={cx(css["container"], className)}>
      <DeckInvestigator deck={deck} size="tooltip" />
      {owned ? (
        <SidebarActions deck={deck} />
      ) : (
        <Button size="full" onClick={onImport}>
          <ImportIcon /> Import deck to collection
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
                {capitalizeSnakeCase(key)}
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

      {deck.previous_deck && (
        <section className={css["details"]} data-testid="share">
          <div
            className={cx(css["detail"], css["full"])}
            data-testid="view-latest-upgrade"
          >
            <header>
              <h3 className={css["detail-label"]}>
                <i className="icon-upgrade" />
                Latest upgrade
              </h3>
            </header>
            <div className={css["detail-value"]}>
              <LatestUpgrade deck={deck} readonly />
            </div>
          </div>
        </section>
      )}

      {owned && <Sharing deck={deck} />}
    </div>
  );
}
