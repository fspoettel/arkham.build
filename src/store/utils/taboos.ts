import { Card } from "@/store/graphql/types";
import { Metadata } from "@/store/slices/metadata/types";

export function applyTaboo(
  card: Card,
  tabooSetId: number | null,
  metadata: Metadata,
): Card {
  if (!tabooSetId) return card;

  const taboo = metadata.taboos[`${card.code}-${tabooSetId}`];
  if (!taboo) return card;

  return {
    ...card,
    ...taboo,
  };
}
