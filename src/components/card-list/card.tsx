import { Card as CardSchema } from "@/store/graphql/types";
import css from "./card.module.css";

type Props = {
  card: CardSchema;
};

export function Card({ card }: Props) {
  if (!card) return null;

  return (
    <figure className={css["card"]}>
      <figcaption>
        <h4>{card.real_name}</h4>
      </figcaption>
    </figure>
  );
}
