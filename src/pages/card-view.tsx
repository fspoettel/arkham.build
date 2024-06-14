import clsx from "clsx";
import { Link, useLocation, useParams } from "wouter";
import { useStore } from "@/store";
import { Card } from "@/components/card/card";

import { selectCardWithRelations } from "@/store/selectors/card-detail";
import { ReactNode, useEffect, useRef } from "react";
import { AppLayout } from "@/components/layouts/app_layout";
import { CenterLayout } from "@/components/layouts/center_layout";
import { Filters } from "@/components/filters/filters";
import { ChevronDownIcon } from "@radix-ui/react-icons";

import css from "./card-view.module.css";

type Props = {
  title: string;
  children: ReactNode;
};

function CardViewSection({ title, children }: Props) {
  return (
    <section className={css["view-section"]}>
      <h2 className={css["view-section-title"]}>{title}</h2>
      <div className={css["view-section-cards"]}>{children}</div>
    </section>
  );
}

export function CardView() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const { code } = useParams();
  const [pathname] = useLocation();

  useEffect(() => {
    scrollerRef.current?.scrollTo(0, 0);
  }, [pathname]);

  const cardWithRelations = useStore((state) =>
    selectCardWithRelations(state, code),
  );
  if (!cardWithRelations) return null;

  const { card, back, relations } = cardWithRelations;

  return (
    <AppLayout
      centerClassName={css["view-center"]}
      sidebar="Deck list"
      filters={<Filters />}
    >
      <CenterLayout
        top={
          <header className={css["view-nav"]}>
            <Link href="/">
              <a className="button button-icon">
                <ChevronDownIcon />
              </a>
            </Link>
          </header>
        }
      >
        <div className={clsx(css["view"])} ref={scrollerRef}>
          {card.type_code === "location" ? (
            <>
              {back && <Card resolvedCard={back} />}
              <Card resolvedCard={cardWithRelations} reversed />
            </>
          ) : (
            <>
              <Card resolvedCard={cardWithRelations} />
              {back && <Card resolvedCard={back} />}
            </>
          )}

          {relations?.parallel && (
            <CardViewSection title="Parallel">
              <Card resolvedCard={relations.parallel} />
            </CardViewSection>
          )}

          {!!relations?.requiredCards?.length && (
            <CardViewSection title="Required cards">
              {relations.requiredCards.map((c) => (
                <Card key={c.card.code} resolvedCard={c} linked />
              ))}
            </CardViewSection>
          )}

          {!!relations?.parallelCards?.length && (
            <CardViewSection title="Parallel cards">
              {relations.parallelCards.map((c) => (
                <Card key={c.card.code} resolvedCard={c} linked />
              ))}
            </CardViewSection>
          )}

          {!!relations?.replacement?.length && (
            <CardViewSection title="Alternate cards">
              {relations.replacement.map((c) => (
                <Card key={c.card.code} resolvedCard={c} linked compact />
              ))}
            </CardViewSection>
          )}

          {!!relations?.advanced?.length && (
            <CardViewSection title="Advanced cards">
              {relations.advanced.map((c) => (
                <Card key={c.card.code} resolvedCard={c} linked compact />
              ))}
            </CardViewSection>
          )}

          {!!relations?.restrictedTo && (
            <CardViewSection title="Restricted">
              <Card resolvedCard={relations.restrictedTo} linked compact />
            </CardViewSection>
          )}

          {!!relations?.bound?.length && (
            <CardViewSection title="Bound Cards">
              {relations.bound.map((c) => (
                <Card key={c.card.code} resolvedCard={c} linked compact />
              ))}
            </CardViewSection>
          )}

          {!!relations?.bonded?.length && (
            <CardViewSection title="Bonded">
              {relations.bonded.map((c) => (
                <Card key={c.card.code} resolvedCard={c} linked compact />
              ))}
            </CardViewSection>
          )}

          {!!relations?.level?.length && (
            <CardViewSection title="Other levels">
              {relations.level.map((c) => (
                <Card key={c.card.code} resolvedCard={c} linked compact />
              ))}
            </CardViewSection>
          )}
        </div>
      </CenterLayout>
    </AppLayout>
  );
}
