import clsx from "clsx";

import { useStore } from "@/store";
import type { CardSet as CardSetType } from "@/store/lib/types";
import {
  selectCanCheckOwnership,
  selectCardOwnedCount,
} from "@/store/selectors/shared";

import css from "./cardset.module.css";

import { CircleHelp } from "lucide-react";
import { ListCard } from "./list-card/list-card";
import { Checkbox } from "./ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

type Props = {
  onChangeCardQuantity?: (code: string, quantity: number) => void;
  onSelect?: (id: string) => void;
  set: CardSetType;
};

export function CardSet(props: Props) {
  const canCheckOwnership = useStore(selectCanCheckOwnership);
  const cardOwnedCount = useStore(selectCardOwnedCount);

  return (
    <article
      data-testid={`cardset-${props.set.id}`}
      className={clsx(css["cardset"], props.set.selected && css["selected"])}
    >
      <header className={css["cardset-header"]}>
        {props.onSelect ? (
          <Checkbox
            checked={props.set.selected}
            className={css["cardset-title"]}
            data-testid="cardset-select"
            disabled={!props.onSelect || !props.set.canSelect}
            id={`card-set-${props.set.id}`}
            label={props.set.title}
            onCheckedChange={() => props.onSelect?.(props.set.id)}
          />
        ) : (
          <h2 className={css["cardset-title"]}>{props.set.title}</h2>
        )}
        {props.set.help && (
          <Tooltip>
            <TooltipTrigger>
              <CircleHelp />
            </TooltipTrigger>
            <TooltipContent>
              <p
                // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML is produced by us.
                dangerouslySetInnerHTML={{ __html: props.set.help }}
              />
            </TooltipContent>
          </Tooltip>
        )}
      </header>
      <ul className={css["cardset-cards"]}>
        {props.set.cards.map(({ card }) => (
          <ListCard
            as="li"
            card={card}
            key={card.code}
            omitBorders
            onChangeCardQuantity={
              props.set.canSetQuantity ? props.onChangeCardQuantity : undefined
            }
            ownedCount={canCheckOwnership ? cardOwnedCount(card) : undefined}
            quantity={props.set.quantities?.[card.code] ?? 0}
          />
        ))}
      </ul>
    </article>
  );
}
