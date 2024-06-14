import clsx from "clsx";
import { useId } from "react";

import type {
  Customization,
  ResolvedCard,
  ResolvedDeck,
} from "@/store/lib/types";
import type { CustomizationOption as CustomizationOptionType } from "@/store/services/types";
import type { Card } from "@/store/services/types";
import { getCardColor, parseCustomizationTextHtml } from "@/utils/card-utils";
import { range } from "@/utils/range";

import css from "./card-customizations.module.css";

import { Checkbox } from "../../ui/checkbox";
import { CustomizationChooseCards } from "./customization-choose-cards";
import { CustomizationChooseSkill } from "./customization-choose-skill";
import { CustomizationChooseTraits } from "./customization-choose-trait";
import { CustomizationRemoveSlot } from "./customization-remove-slot";

type Props = {
  activeDeck: ResolvedDeck<ResolvedCard>;
  card: Card;
};

export function CardCustomizationsEdit({ activeDeck, card }: Props) {
  const backgroundCls = getCardColor(card, "background");

  const choices = activeDeck.customizations?.[card.code];

  const options = card.customization_options;
  const text = card.real_customization_text?.split("\n");

  if (!options || !text) return null;

  const xpMax = options.reduce<number>(
    (acc, curr) => (curr.xp > acc ? curr.xp : acc),
    0,
  );

  return (
    <article className={css["customizations"]}>
      <header className={clsx(css["header"], backgroundCls)}>
        <h3 className={css["header-title"]}>Customizations</h3>
      </header>
      <div className={css["customizations-text"]}>
        {options.map((option, index) => (
          <CustomizationOption
            card={card}
            key={index}
            option={option}
            index={index}
            choices={choices}
            text={text}
            xpMax={xpMax}
          />
        ))}
      </div>
    </article>
  );
}

function CustomizationOption({
  card,
  choices,
  option,
  index,
  text,
  xpMax,
}: {
  card: Card;
  choices?: Record<number, Customization>;
  index: number;
  option: CustomizationOptionType;
  text: string[];
  xpMax: number;
}) {
  const id = useId();
  const choice = choices?.[index];
  const checkedCount = choice?.xpSpent ?? 0;

  return (
    <div
      className={css["customization"]}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      style={{ "--customization-xp-max": xpMax } as any}
    >
      <div className={css["customization-checks"]}>
        {!!option.xp &&
          range(0, option.xp).map((i) => (
            <Checkbox
              id={id}
              hideLabel
              label
              key={i}
              checked={i < checkedCount}
            />
          ))}
      </div>
      <div className={css["customization-content"]}>
        <p
          dangerouslySetInnerHTML={{
            __html: parseCustomizationTextHtml(text[index]),
          }}
        />

        {choice?.unlocked && option.choice === "choose_skill" && (
          <CustomizationChooseSkill id={id} choice={choice?.choices ?? ""} />
        )}

        {choice?.unlocked && option.choice === "remove_slot" && (
          <CustomizationRemoveSlot
            id={id}
            card={card}
            choice={choice?.choices ?? ""}
          />
        )}

        {choice?.unlocked && option.choice === "choose_trait" && (
          <CustomizationChooseTraits
            id={id}
            limit={option.quantity ?? 1}
            choices={choice?.choices?.split("^") ?? []}
          />
        )}

        {choice?.unlocked && option.choice === "choose_card" && option.card && (
          <CustomizationChooseCards
            id={id}
            limit={option.quantity ?? 1}
            choices={choice?.choices?.split("^") ?? []}
            config={option.card}
          />
        )}
      </div>
    </div>
  );
}
