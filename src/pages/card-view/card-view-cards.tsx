import { Redirect } from "wouter";

import { Card } from "@/components/card/card";
import { Customizations } from "@/components/customizations/customizations";
import { CustomizationsEditor } from "@/components/customizations/customizations-editor";
import { Faq } from "@/pages/card-view/faq";
import { useStore } from "@/store";
import type { CardWithRelations } from "@/store/lib/types";
import { selectActiveDeck } from "@/store/selectors/decks";
import { formatRelationTitle } from "@/utils/formatting";

import css from "./card-view.module.css";

function CardViewSection({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <section className={css["view-section"]} id={id}>
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

  if (canonicalCode) {
    const href = `/card/${canonicalCode}`;

    return (
      <Redirect
        replace
        to={cardWithRelations.card.parallel ? `${href}#parallel` : href}
      />
    );
  }

  return (
    <>
      <Card resolvedCard={cardWithRelations}>
        {cardWithRelations.card.customization_options ? (
          activeDeck ? (
            <CustomizationsEditor
              activeDeck={activeDeck}
              card={cardWithRelations.card}
            />
          ) : (
            <Customizations card={cardWithRelations.card} />
          )
        ) : undefined}
      </Card>

      <Faq card={cardWithRelations.card} />

      {relations?.parallel && (
        <CardViewSection id="parallel" title={formatRelationTitle("parallel")}>
          <Card resolvedCard={relations.parallel} />
        </CardViewSection>
      )}

      {!!relations?.bound?.length && (
        <CardViewSection title={formatRelationTitle("bound")}>
          {relations.bound.map((c) => (
            <Card
              canToggleBackside
              key={c.card.code}
              linked
              resolvedCard={c}
              size="compact"
            />
          ))}
        </CardViewSection>
      )}

      {!!relations?.bonded?.length && (
        <CardViewSection title={formatRelationTitle("bonded")}>
          {relations.bonded.map((c) => (
            <Card
              canToggleBackside
              key={c.card.code}
              linked
              resolvedCard={c}
              size="compact"
            />
          ))}
        </CardViewSection>
      )}

      {!!relations?.requiredCards?.length && (
        <CardViewSection title={formatRelationTitle("requiredCards")}>
          {relations.requiredCards.map((c) => (
            <Card
              canToggleBackside
              key={c.card.code}
              linked
              resolvedCard={c}
              size="compact"
            />
          ))}
        </CardViewSection>
      )}

      {!!relations?.advanced?.length && (
        <CardViewSection title={formatRelationTitle("advanced")}>
          {relations.advanced.map((c) => (
            <Card
              canToggleBackside
              key={c.card.code}
              linked
              resolvedCard={c}
              size="compact"
            />
          ))}
        </CardViewSection>
      )}

      {!!relations?.parallelCards?.length && (
        <CardViewSection title={formatRelationTitle("parallelCards")}>
          {relations.parallelCards.map((c) => (
            <Card
              canToggleBackside
              key={c.card.code}
              linked
              resolvedCard={c}
              size="compact"
            />
          ))}
        </CardViewSection>
      )}

      {!!relations?.replacement?.length && (
        <CardViewSection title={formatRelationTitle("replacement")}>
          {relations.replacement.map((c) => (
            <Card
              canToggleBackside
              key={c.card.code}
              linked
              resolvedCard={c}
              size="compact"
            />
          ))}
        </CardViewSection>
      )}

      {!!relations?.restrictedTo && (
        <CardViewSection title={formatRelationTitle("restricted")}>
          <Card
            canToggleBackside
            linked
            resolvedCard={relations.restrictedTo}
            size="compact"
          />
        </CardViewSection>
      )}

      {!!relations?.level?.length && (
        <CardViewSection title={formatRelationTitle("level")}>
          {relations.level.map((c) => (
            <Card
              canToggleBackside
              key={c.card.code}
              linked
              resolvedCard={c}
              size="compact"
            />
          ))}
        </CardViewSection>
      )}
    </>
  );
}
