import Unique from "@/assets/icons/icon_unique.svg?react";
import { cx } from "@/utils/cx";
import { Link } from "wouter";

import type { Card } from "@/store/services/queries.types";
import { useCardModalContext } from "../card-modal/card-modal-context";
import css from "./card.module.css";

type Props = {
  card: Card;
  titleLinks?: "card" | "modal";
};

export function CardNames(props: Props) {
  const { card, titleLinks } = props;

  const cardModalContext = useCardModalContext();

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
        {!titleLinks && cardName}
      </h1>
      {card.real_subname && <h2 className={css["sub"]}>{card.real_subname}</h2>}
    </div>
  );
}
