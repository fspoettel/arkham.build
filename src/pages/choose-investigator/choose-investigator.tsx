import clsx from "clsx";
import { ChevronLeft, CirclePlusIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "wouter";

import { CardList } from "@/components/card-list/card-list";
import { Filters } from "@/components/filters/filters";
import { Masthead } from "@/components/masthead";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store";
import { selectCardRelationsResolver } from "@/store/selectors/card-list";
import { useDocumentTitle } from "@/utils/use-document-title";
import { useGoBack } from "@/utils/use-go-back";

import css from "./choose-investigator.module.css";

import { SignatureLink } from "./signature-link";

function DeckCreateChooseInvestigator() {
  const [filtersOpen, onToggleFilters] = useState(false);

  const goBack = useGoBack();
  const activeListId = useStore((state) => state.activeList);

  const resetFilters = useStore((state) => state.resetFilters);
  const setActiveList = useStore((state) => state.setActiveList);

  const cardResolver = useStore(selectCardRelationsResolver);

  useDocumentTitle("Choose investigator");

  const onContentClick = useCallback(
    (evt: React.PointerEvent) => {
      if (!filtersOpen) return;
      evt.preventDefault();
      onToggleFilters(false);
    },
    [onToggleFilters, filtersOpen],
  );

  useEffect(() => {
    setActiveList("create_deck");
  }, [resetFilters, setActiveList]);

  if (activeListId !== "create_deck") return null;

  return (
    <div
      className={clsx(css["layout"], filtersOpen && css["filters-open"])}
      onPointerDown={onContentClick}
    >
      <Masthead className={css["masthead"]} />
      <main className={css["content"]}>
        <header className={css["header"]}>
          <Button onClick={goBack}>
            <ChevronLeft /> Back
          </Button>
          <h1 className={css["title"]}>Choose investigator</h1>
        </header>
        <CardList
          renderListCardAction={(card) => (
            <Link asChild to={`/deck/create/${card.code}`}>
              <Button as="a" size="lg" variant="bare">
                <CirclePlusIcon />
              </Button>
            </Link>
          )}
          renderListCardExtra={({ code }) => {
            const resolved = cardResolver(code);
            const signatures = resolved?.relations?.requiredCards;
            if (!signatures?.length) return null;

            return (
              <ul className={css["signatures"]}>
                {signatures.map(({ card }) => (
                  <SignatureLink card={card} key={card.code} />
                ))}
              </ul>
            );
          }}
          slotRight={
            <Button
              className={css["toggle-filters"]}
              onClick={() => onToggleFilters(true)}
            >
              <i className="icon-filter" />
            </Button>
          }
        />
      </main>
      <nav
        className={css["filters"]}
        data-state={filtersOpen ? "open" : "closed"}
      >
        <Filters />
      </nav>
    </div>
  );
}

export default DeckCreateChooseInvestigator;
