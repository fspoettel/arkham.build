import type { CustomizationUpgrade } from "@/store/selectors/decks";

import { CustomizationOption } from "@/components/customizations/customization-option";
import { ListCard } from "@/components/list-card/list-card";
import css from "./deck-history.module.css";

type Props = {
  title: React.ReactNode;
  differences: CustomizationUpgrade[];
};

export function CustomizableDiff(props: Props) {
  return (
    <article className={css["diffs-container"]}>
      <header>
        <h4 className={css["diffs-title"]}>{props.title}</h4>
      </header>
      <ol className={css["diffs"]}>
        {props.differences.map(({ card, diff }) => (
          <li key={card.code}>
            <ListCard key={card.code} card={card} omitBorders size="sm" />
            <ol className={css["diff-customizations"]}>
              {diff.map(
                (customization) =>
                  !!card.customization_options &&
                  !!card.real_customization_text && (
                    <li key={customization.index}>
                      <CustomizationOption
                        card={card}
                        index={customization.index}
                        choice={customization}
                        omitOptionText
                        option={card.customization_options[customization.index]}
                        text={card.real_customization_text.split("\n")}
                      />
                    </li>
                  ),
              )}
            </ol>
          </li>
        ))}
      </ol>
    </article>
  );
}
