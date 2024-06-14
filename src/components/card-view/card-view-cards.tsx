import { type ReactNode } from "react";
import { Redirect } from "wouter";

import { Card } from "@/components/card/card";
import { CardCustomizations } from "@/components/card/customizations/card-customizations";
import { CardCustomizationsEdit } from "@/components/card/customizations/card-customizations-edit";
import { Faq } from "@/pages/card-view/faq";
import { useStore } from "@/store";
import type { CardWithRelations } from "@/store/lib/types";
import { selectActiveDeck } from "@/store/selectors/decks";

import css from "./card-view-cards.module.css";

function CardViewSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className={css["view-section"]}>
      <h2 className={css["view-section-title"]}>{title}</h2>
      <div className={css["view-section-cards"]}>{children}</div>
    </section>
  );
}

export function CardViewCards({
  cardWithRelations,
}: {
  cardWithRelations: CardWithRelations;
}) {
  const activeDeck = useStore(selectActiveDeck);

  const { relations } = cardWithRelations;

  const canonicalCode =
    cardWithRelations.card.duplicate_of_code ??
    cardWithRelations.card.alternate_of_code;

  if (canonicalCode) return <Redirect to={`/card/${canonicalCode}`} replace />;

  return (
    <>
      <Card resolvedCard={cardWithRelations}>
        {cardWithRelations.card.customization_options ? (
          activeDeck ? (
            <CardCustomizationsEdit
              activeDeck={activeDeck}
              card={cardWithRelations.card}
            />
          ) : (
            <CardCustomizations card={cardWithRelations.card} />
          )
        ) : undefined}
      </Card>

      <Faq card={cardWithRelations.card} />

      {relations?.parallel && (
        <CardViewSection title="Parallel">
          <Card resolvedCard={relations.parallel} />
        </CardViewSection>
      )}

      {!!relations?.bound?.length && (
        <CardViewSection title="Bound Cards">
          {relations.bound.map((c) => (
            <Card
              key={c.card.code}
              resolvedCard={c}
              linked
              size="compact"
              canToggleBackside
            />
          ))}
        </CardViewSection>
      )}

      {!!relations?.bonded?.length && (
        <CardViewSection title="Bonded">
          {relations.bonded.map((c) => (
            <Card
              key={c.card.code}
              resolvedCard={c}
              linked
              size="compact"
              canToggleBackside
            />
          ))}
        </CardViewSection>
      )}

      {!!relations?.requiredCards?.length && (
        <CardViewSection title="Required cards">
          {relations.requiredCards.map((c) => (
            <Card
              key={c.card.code}
              resolvedCard={c}
              linked
              size="compact"
              canToggleBackside
            />
          ))}
        </CardViewSection>
      )}

      {!!relations?.advanced?.length && (
        <CardViewSection title="Advanced cards">
          {relations.advanced.map((c) => (
            <Card
              key={c.card.code}
              resolvedCard={c}
              linked
              size="compact"
              canToggleBackside
            />
          ))}
        </CardViewSection>
      )}

      {!!relations?.parallelCards?.length && (
        <CardViewSection title="Parallel cards">
          {relations.parallelCards.map((c) => (
            <Card
              key={c.card.code}
              resolvedCard={c}
              linked
              size="compact"
              canToggleBackside
            />
          ))}
        </CardViewSection>
      )}

      {!!relations?.replacement?.length && (
        <CardViewSection title="Alternate cards">
          {relations.replacement.map((c) => (
            <Card
              key={c.card.code}
              resolvedCard={c}
              linked
              size="compact"
              canToggleBackside
            />
          ))}
        </CardViewSection>
      )}

      {!!relations?.restrictedTo && (
        <CardViewSection title="Restricted">
          <Card
            resolvedCard={relations.restrictedTo}
            linked
            size="compact"
            canToggleBackside
          />
        </CardViewSection>
      )}

      {!!relations?.level?.length && (
        <CardViewSection title="Other levels">
          {relations.level.map((c) => (
            <Card
              key={c.card.code}
              resolvedCard={c}
              linked
              size="compact"
              canToggleBackside
            />
          ))}
        </CardViewSection>
      )}
    </>
  );
}
