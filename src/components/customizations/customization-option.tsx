import { useId, useMemo } from "react";

import type { Customization } from "@/store/lib/types";
import type {
  Card,
  CustomizationOption as CustomizationOptionType,
} from "@/store/services/queries.types";
import type { CustomizationEdit } from "@/store/slices/deck-edits.types";
import { parseCustomizationTextHtml } from "@/utils/card-utils";
import { range } from "@/utils/range";

import css from "./customizations.module.css";

import { Checkbox } from "../ui/checkbox";
import { CustomizationChooseCards } from "./customization-choose-cards";
import { CustomizationChooseSkill } from "./customization-choose-skill";
import { CustomizationChooseTraits } from "./customization-choose-trait";
import { CustomizationRemoveSlot } from "./customization-remove-slot";

type Props = {
  card: Card;
  choices?: Record<number, Customization>;
  disabled?: boolean;
  index: number;
  onChange: (index: number, edit: CustomizationEdit) => void;
  option: CustomizationOptionType;
  text: string[];
  xpMax: number;
};

export function CustomizationOption(props: Props) {
  const { card, choices, disabled, index, onChange, option, text, xpMax } =
    props;

  const id = useId();
  const choice = choices?.[index];
  const xpSpent = choice?.xp_spent ?? 0;

  const selections = choice?.selections?.split("^").filter((x) => x) ?? [];

  const cssVariables = useMemo(
    () => ({
      "--customization-xp-max": xpMax,
    }),
    [xpMax],
  );

  const unlocked = xpSpent >= option.xp;

  return (
    <div
      className={css["customization"]}
      style={cssVariables as React.CSSProperties}
    >
      <div className={css["checks"]}>
        {!!option.xp &&
          range(0, option.xp).map((i) => (
            <Checkbox
              checked={i < xpSpent}
              disabled={disabled}
              hideLabel
              id={id}
              key={i}
              label=""
              onCheckedChange={(val) => {
                if (val) {
                  onChange(index, { xp_spent: i + 1 });
                } else {
                  onChange(index, { xp_spent: i });
                }
              }}
            />
          ))}
      </div>
      <div className={css["content"]}>
        <p
          // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML is from trusted source.
          dangerouslySetInnerHTML={{
            __html: parseCustomizationTextHtml(text[index]),
          }}
        />

        {unlocked && option.choice === "choose_skill" && (
          <CustomizationChooseSkill
            disabled={disabled}
            id={id}
            onChange={(selections) => onChange(index, { selections })}
            selections={selections}
          />
        )}

        {unlocked && option.choice === "remove_slot" && (
          <CustomizationRemoveSlot
            card={card}
            disabled={disabled}
            id={id}
            onChange={(selections) => onChange(index, { selections })}
            selections={selections}
          />
        )}

        {unlocked && option.choice === "choose_trait" && (
          <CustomizationChooseTraits
            disabled={disabled}
            id={id}
            limit={option.quantity ?? 1}
            onChange={(selections) => onChange(index, { selections })}
            selections={selections}
          />
        )}

        {unlocked && option.choice === "choose_card" && option.card && (
          <CustomizationChooseCards
            config={option.card}
            disabled={disabled}
            id={id}
            limit={option.quantity ?? 1}
            onChange={(selections) => onChange(index, { selections })}
            selections={selections}
          />
        )}
      </div>
    </div>
  );
}
