import SvgWorld from "@/assets/icons/world.svg?react";
import { CardWithRelations } from "@/store/selectors/card-view";

import css from "./card-view-sidebar.module.css";

import { Button } from "../../components/ui/button";
import { Faq } from "./faq";

type Props = {
  resolvedCard: CardWithRelations;
};

export function CardViewSidebar({ resolvedCard }: Props) {
  const { card } = resolvedCard;

  return (
    <div className={css["sidebar"]}>
      <nav className={css["sidebar-links"]}>
        <Button
          size="full"
          as="a"
          href={`https://arkhamdb.com/card/${card.code}`}
          target="_blank"
          rel="noreferrer"
        >
          <SvgWorld /> Open on ArkhamDB
        </Button>
      </nav>
      <Faq card={resolvedCard.card} />
    </div>
  );
}
