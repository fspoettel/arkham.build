import type { CardWithRelations, ResolvedCard } from "@/store/lib/types";
import { sideways } from "@/utils/card-utils";
import { cx } from "@/utils/cx";
import { CardScan } from "../card-scan";
import { CardThumbnail } from "../card-thumbnail";
import { CardDetails } from "./card-details";
import { CardHeader } from "./card-header";
import { CardIcons } from "./card-icons";
import { CardMeta } from "./card-meta";
import { CardTabooText } from "./card-taboo-text";
import { CardText } from "./card-text";
import css from "./card.module.css";

type Props = {
  className?: string;
  children?: React.ReactNode;
  slotHeaderActions?: React.ReactNode;
  resolvedCard: CardWithRelations | ResolvedCard;
  titleLinks?: "card" | "card-modal" | "dialog";
  size: "compact" | "tooltip" | "full";
} & React.HTMLAttributes<HTMLDivElement>;

export function CardFace(props: Props) {
  const {
    children,
    className,
    slotHeaderActions,
    resolvedCard,
    titleLinks,
    size,
    ...rest
  } = props;

  const { card } = resolvedCard;
  const isSideways = sideways(card);

  const showImage = size === "full" || card.type_code !== "story";

  return (
    <article
      className={cx(
        css["card"],
        isSideways && css["sideways"],
        showImage && css["has-image"],
        css[size],
        className,
      )}
      data-testid="card-face"
      {...rest}
    >
      <CardHeader
        card={card}
        slotHeaderActions={slotHeaderActions}
        titleLinks={titleLinks}
      />

      <div className={css["pre"]}>
        <CardDetails card={card} />
        <CardIcons card={card} />
      </div>

      <div className={css["content"]}>
        <CardText
          flavor={card.real_flavor}
          size={size}
          text={card.real_text}
          typeCode={card.type_code}
          victory={card.victory}
        />
        <CardTabooText card={card} />
        <CardMeta resolvedCard={resolvedCard} size={size} />
        {children}
      </div>

      {showImage &&
        (size === "full" ? (
          <div className={css["image"]}>
            <CardScan code={card.code} sideways={isSideways} />
          </div>
        ) : (
          <div className={css["image"]}>
            <CardThumbnail card={card} />
          </div>
        ))}
    </article>
  );
}
