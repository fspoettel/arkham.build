import clsx from "clsx";
import { useParams } from "wouter";

import SvgWorld from "@/assets/icons/world.svg?react";
import { CardViewCards } from "@/components/card-view/card-view-cards";
import { Masthead } from "@/components/masthead";
import { Button } from "@/components/ui/button";
import { useStore } from "@/store";
import { selectCardWithRelations } from "@/store/selectors/card-view";
import { useDocumentTitle } from "@/utils/use-document-title";

import css from "./card-view.module.css";

export function CardView() {
  const { code } = useParams();

  const cardWithRelations = useStore((state) =>
    selectCardWithRelations(state, code, true),
  );

  useDocumentTitle(
    cardWithRelations ? `${cardWithRelations.card.real_name}` : undefined,
  );

  if (!cardWithRelations) return null;

  return (
    <div className={clsx(css["layout"])}>
      <Masthead className={css["header"]} />
      <main className={css["layout-cards"]}>
        <nav className={css["layout-sidebar"]}>
          <Button
            as="a"
            href={`https://arkhamdb.com/card/${cardWithRelations.card.code}`}
            target="_blank"
            rel="noreferrer"
          >
            <SvgWorld /> Open on ArkhamDB
          </Button>
        </nav>
        <CardViewCards
          key={cardWithRelations.card.code}
          cardWithRelations={cardWithRelations}
        />
      </main>
    </div>
  );
}
