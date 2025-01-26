import Unique from "@/assets/icons/icon_unique.svg?react";
import { useStore } from "@/store";
import { selectCardLevelDisplaySetting } from "@/store/selectors/settings";
import type { Card } from "@/store/services/queries.types";
import { parseCardTitle } from "@/utils/card-utils";
import { cx } from "@/utils/cx";
import { Link } from "wouter";
import { useCardModalContextChecked } from "../card-modal/card-modal-context";
import { CardName } from "../card-name";
import { useDialogContext } from "../ui/dialog.hooks";
import css from "./card.module.css";

type Props = {
  card: Card;
  titleLinks?: "card" | "card-modal" | "dialog";
};

export function CardNames(props: Props) {
  const { card, titleLinks } = props;

  const cardModalContext = useCardModalContextChecked();
  const dialogContext = useDialogContext();
  const cardLevelDisplay = useStore(selectCardLevelDisplaySetting);

  const cardName = (
    <>
      {card.parallel && <i className={cx(css["parallel"], "icon-parallel")} />}
      <CardName card={card} cardLevelDisplay={cardLevelDisplay} />{" "}
      <span className={css["unique"]}>{card.is_unique && <Unique />}</span>
    </>
  );

  return (
    <div>
      <h1 className={css["name"]} data-testid="card-name">
        {titleLinks === "card" && (
          <Link href={`/card/${card.code}`}>{cardName}</Link>
        )}
        {titleLinks === "card-modal" && cardModalContext && (
          <button
            onClick={() => cardModalContext.setOpen({ code: card.code })}
            type="button"
          >
            {cardName}
          </button>
        )}
        {titleLinks === "dialog" && dialogContext && (
          <button onClick={() => dialogContext.setOpen(true)} type="button">
            {cardName}
          </button>
        )}
        {!titleLinks && cardName}
      </h1>
      {card.real_subname && (
        <h2
          className={css["sub"]}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: safe and necessary.
          dangerouslySetInnerHTML={{
            __html: parseCardTitle(card.real_subname),
          }}
        />
      )}
    </div>
  );
}
