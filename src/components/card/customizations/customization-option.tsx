import { useId, useMemo } from "react";

import type { Customization } from "@/store/lib/types";
import type {
  Card,
  CustomizationOption as CustomizationOptionType,
} from "@/store/services/types";
import { parseCustomizationTextHtml } from "@/utils/card-utils";
import { range } from "@/utils/range";

import css from "./card-customizations.module.css";

import { Checkbox } from "../../ui/checkbox";
import { CustomizationChooseCards } from "./customization-choose-cards";
import { CustomizationChooseSkill } from "./customization-choose-skill";
import { CustomizationChooseTraits } from "./customization-choose-trait";
import { CustomizationRemoveSlot } from "./customization-remove-slot";

type Props = {
  card: Card;
  choices?: Record<number, Customization>;
  index: number;
  option: CustomizationOptionType;
  text: string[];
  xpMax: number;
};

export function CustomizationOption({
  card,
  choices,
  option,
  index,
  text,
  xpMax,
}: Props) {
  const id = useId();
  const choice = choices?.[index];
  const checkedCount = choice?.xpSpent ?? 0;

  const cssVariables = useMemo(
    () => ({
      "--customization-xp-max": xpMax,
    }),
    [xpMax],
  );

  return (
    <div
      className={css["customization"]}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      style={cssVariables as any}
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
