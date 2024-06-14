import { reversed } from "@/utils/card-utils";

import { Card, Props as CardProps } from "./card";

type Props = CardProps;

/**
 * Renders a card with a linked backside if present and not `compact`.
 */
export function ResolvedCard({ resolvedCard, size, ...rest }: Props) {
  const { card, back } = resolvedCard;

  const frontNode = <Card resolvedCard={resolvedCard} {...rest} size={size} />;

  const backNode =
    size !== "compact" && back ? (
      <Card resolvedCard={back} size={size} {...rest} linked={false} />
    ) : undefined;

  return reversed(card) ? (
    <>
      {backNode}
      {frontNode}
    </>
  ) : (
    <>
      {frontNode}
      {backNode}
    </>
  );
}
