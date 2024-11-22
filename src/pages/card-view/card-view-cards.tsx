import { Card } from "@/components/card/card";
import { CustomizationsEditor } from "@/components/customizations/customizations-editor";
import type { CardWithRelations } from "@/store/lib/types";
import { formatRelationTitle } from "@/utils/formatting";
import { Redirect } from "wouter";
import css from "./card-view.module.css";

type Props = {
  title: string;
  children: React.ReactNode;
  id?: string;
};

function CardViewSection(props: Props) {
  const { title, children, id } = props;

  return (
    <section className={css["view-section"]} id={id} data-testid={id}>
      <h2 className={css["view-section-title"]}>{title}</h2>
      <div className={css["view-section-cards"]}>{children}</div>
    </section>
  );
}

// FIXME: This should loop over relations, same as the card modal.
export function CardViewCards({
  cardWithRelations,
}: {
  cardWithRelations: CardWithRelations;
}) {
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
      <div data-testid="main">
        <Card resolvedCard={cardWithRelations}>
          {cardWithRelations.card.customization_options ? (
            <CustomizationsEditor card={cardWithRelations.card} />
          ) : undefined}
        </Card>
      </div>

      {relations?.parallel && (
        <CardViewSection id="parallel" title={formatRelationTitle("parallel")}>
          <Card resolvedCard={relations.parallel} />
        </CardViewSection>
      )}

      {!!relations?.bound?.length && (
        <CardViewSection id="bound" title={formatRelationTitle("bound")}>
          {relations.bound.map((c) => (
            <Card
              canToggleBackside
              key={c.card.code}
              titleLinks="card"
              resolvedCard={c}
              size="compact"
            />
          ))}
        </CardViewSection>
      )}

      {!!relations?.bonded?.length && (
        <CardViewSection id="bonded" title={formatRelationTitle("bonded")}>
          {relations.bonded.map((c) => (
            <Card
              canToggleBackside
              key={c.card.code}
              titleLinks="card"
              resolvedCard={c}
              size="compact"
            />
          ))}
        </CardViewSection>
      )}

      {!!relations?.requiredCards?.length && (
        <CardViewSection
          id="required"
          title={formatRelationTitle("requiredCards")}
        >
          {relations.requiredCards.map((c) => (
            <Card
              canToggleBackside
              key={c.card.code}
              titleLinks="card"
              resolvedCard={c}
              size="compact"
            />
          ))}
        </CardViewSection>
      )}

      {!!relations?.advanced?.length && (
        <CardViewSection id="advanced" title={formatRelationTitle("advanced")}>
          {relations.advanced.map((c) => (
            <Card
              canToggleBackside
              key={c.card.code}
              titleLinks="card"
              resolvedCard={c}
              size="compact"
            />
          ))}
        </CardViewSection>
      )}

      {!!relations?.parallelCards?.length && (
        <CardViewSection
          id="parallel-cards"
          title={formatRelationTitle("parallelCards")}
        >
          {relations.parallelCards.map((c) => (
            <Card
              canToggleBackside
              key={c.card.code}
              titleLinks="card"
              resolvedCard={c}
              size="compact"
            />
          ))}
        </CardViewSection>
      )}

      {!!relations?.replacement?.length && (
        <CardViewSection
          id="replacement"
          title={formatRelationTitle("replacement")}
        >
          {relations.replacement.map((c) => (
            <Card
              canToggleBackside
              key={c.card.code}
              titleLinks="card"
              resolvedCard={c}
              size="compact"
            />
          ))}
        </CardViewSection>
      )}

      {!!relations?.restrictedTo && (
        <CardViewSection
          id="restricted-to"
          title={formatRelationTitle("restricted")}
        >
          {relations.restrictedTo.map((c) => (
            <Card
              canToggleBackside
              key={c.card.code}
              titleLinks="card"
              resolvedCard={c}
              size="compact"
            />
          ))}
        </CardViewSection>
      )}

      {!!relations?.level?.length && (
        <CardViewSection id="level" title={formatRelationTitle("level")}>
          {relations.level.map((c) => (
            <Card
              canToggleBackside
              key={c.card.code}
              titleLinks="card"
              resolvedCard={c}
              size="compact"
            />
          ))}
        </CardViewSection>
      )}

      {!!relations?.otherSignatures?.length && (
        <CardViewSection
          id="other-signatures"
          title={formatRelationTitle("otherSignatures")}
        >
          {relations.otherSignatures.map((c) => (
            <Card
              canToggleBackside
              key={c.card.code}
              titleLinks="card"
              resolvedCard={c}
              size="compact"
            />
          ))}
        </CardViewSection>
      )}
    </>
  );
}
