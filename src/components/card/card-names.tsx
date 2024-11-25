import Unique from "@/assets/icons/icon_unique.svg?react";
import type { Card } from "@/store/services/queries.types";
import { cx } from "@/utils/cx";
import { Link } from "wouter";
import { useCardModalContext } from "../card-modal/card-modal-context";
import { useDialogContext } from "../ui/dialog.hooks";
import css from "./card.module.css";

type Props = {
  card: Card;
  titleLinks?: "card" | "modal" | "dialog";
};

export function CardNames(props: Props) {
  const { card, titleLinks } = props;

  const cardModalContext = useCardModalContext();
  const dialogContext = useDialogContext();

  const cardName = (
    <>
      {card.parallel && <i className={cx(css["parallel"], "icon-parallel")} />}
      {card.real_name}{" "}
      <span className={css["unique"]}>{card.is_unique && <Unique />}</span>
    </>
  );

  return (
    <div>
      <h1 className={css["name"]} data-testid="card-name">
        {titleLinks === "card" && (
          <Link href={`/card/${card.code}`}>{cardName}</Link>
        )}
        {titleLinks === "modal" && cardModalContext && (
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
      {card.real_subname && <h2 className={css["sub"]}>{card.real_subname}</h2>}
    </div>
  );
}
