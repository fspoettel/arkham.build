import type {
  CardResolved,
  CardWithRelations,
} from "@/store/utils/card-resolver";
import { reversed } from "@/utils/card-utils";

import { CardBack } from "./card-back";
import { CardCustomizations } from "./card-customizations";
import { CardFront } from "./card-front";

export type Props = {
  className?: string;
  resolvedCard: CardResolved | CardWithRelations;
  canToggleBack?: boolean;
  linked?: boolean;
  size?: "compact" | "tooltip" | "full";
};

/**
 * Renders a card with a "simple" back-side that is tracked on the same card object.
 * Cards are available in three sizes:
 *  - `full`: Renders a full card with all metadata.
 *  - `compact`: Renders a card without its backside and with a smaller card image.
 *  - `tooltip`: Renders the card as a tooltip that is shown in card lists.
 * TODO: a lot of the aspects about this (CSS, selectors) should be cleaned up a bit.
 */
export function Card({
  className,
  resolvedCard,
  linked,
  size = "full",
}: Props) {
  const { card } = resolvedCard;

  const front = (
    <CardFront
      resolvedCard={resolvedCard}
      size={size}
      linked={linked}
      className={className}
    />
  );

  const showCustomizations = size === "full" && card.customization_options;

  const customizations = showCustomizations ? (
    <CardCustomizations card={card} />
  ) : undefined;

  const showBack =
    size !== "compact" && card.double_sided && !card.back_link_id;

  const back = showBack && <CardBack card={card} size={size} />;

  return reversed(card) ? (
    <>
      {back}
      {customizations}
      {front}
    </>
  ) : (
    <>
      {front}
      {customizations}
      {back}
    </>
  );
}
