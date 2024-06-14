import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { Link } from "wouter";

import SvgWorld from "@/assets/icons/world.svg?react";
import { Scroller } from "@/components/ui/scroll-area";
import type { CardWithRelations } from "@/store/selectors/card-view";

import css from "./card-view-sidebar.module.css";

import { Button } from "../../components/ui/button";
import { Faq } from "./faq";

type Props = {
  resolvedCard: CardWithRelations;
};

export function CardViewSidebar({ resolvedCard }: Props) {
  const { card } = resolvedCard;

  return (
    <Scroller>
      <div className={css["sidebar"]}>
        <nav className={css["sidebar-nav"]}>
          <Link href="/">
            <Button as="a" size="full">
              <ChevronLeftIcon /> Back
            </Button>
          </Link>
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
    </Scroller>
  );
}
