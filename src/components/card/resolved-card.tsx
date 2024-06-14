import { reversed } from "@/utils/card-utils";

import type { Props as CardProps } from "./card";
import { Card } from "./card";

type Props = CardProps;

/**
 * Renders a card with a linked backside if present and not `compact`.
 */
export function ResolvedCard({ resolvedCard, size, ...rest }: Props) {
  const { card, back } = resolvedCard;

  const frontNode = <Card {...rest} resolvedCard={resolvedCard} size={size} />;

  const backNode =
    size !== "compact" && back ? (
      <Card {...rest} resolvedCard={back} size={size} linked={false} />
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
