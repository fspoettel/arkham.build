import { Redirect } from "wouter";

import { Card } from "@/components/card/card";
import { Customizations } from "@/components/customizations/customizations";
import { CustomizationsEditor } from "@/components/customizations/customizations-editor";
import { Faq } from "@/pages/card-view/faq";
import { useStore } from "@/store";
import type { CardWithRelations } from "@/store/lib/types";
import { selectActiveDeck } from "@/store/selectors/decks";
import { getCardSetTitle } from "@/utils/cardsets";

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
        <CardViewSection id="parallel" title={getCardSetTitle("parallel")}>
          <Card resolvedCard={relations.parallel} />
        </CardViewSection>
      )}

      {!!relations?.bound?.length && (
        <CardViewSection title={getCardSetTitle("bound")}>
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
        <CardViewSection title={getCardSetTitle("bonded")}>
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
        <CardViewSection title={getCardSetTitle("requiredCards")}>
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
        <CardViewSection title={getCardSetTitle("advanced")}>
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
        <CardViewSection title={getCardSetTitle("parallelCards")}>
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
        <CardViewSection title={getCardSetTitle("replacement")}>
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
        <CardViewSection title={getCardSetTitle("restricted")}>
          <Card
            canToggleBackside
            linked
            resolvedCard={relations.restrictedTo}
            size="compact"
          />
        </CardViewSection>
      )}

      {!!relations?.level?.length && (
        <CardViewSection title={getCardSetTitle("level")}>
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
