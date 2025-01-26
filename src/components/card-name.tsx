import type { Card } from "@/store/services/queries.types";
import { cardLevel, parseCardTextHtml } from "@/utils/card-utils";
import css from "./card-name.module.css";
import { ExperienceDots } from "./experience-dots";

interface Props {
  card: Card;
  cardLevelDisplay: "icon-only" | "dots" | "text";
}

export function CardName(props: Props) {
  const { card, cardLevelDisplay } = props;
  const level = cardLevel(card);

  return (
    <span className={css["name"]}>
      <span
        // biome-ignore lint/security/noDangerouslySetInnerHtml: safe.
        dangerouslySetInnerHTML={{
          __html: parseCardTextHtml(card.real_name),
        }}
      />
      {!!level && cardLevelDisplay === "dots" && <ExperienceDots xp={level} />}
      {!!level && cardLevelDisplay === "text" && (
        <span className={css["xp"]}>({level})</span>
      )}
    </span>
  );
}
