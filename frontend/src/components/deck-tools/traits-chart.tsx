import { useTranslation } from "react-i18next";
import type { ChartableData } from "@/store/lib/deck-charts";
import { Scroller } from "../ui/scroller";
import type { ChartSelection } from "./chart-cards";
import css from "./deck-tools.module.css";

type Props = {
  data: ChartableData<string>;
  onSelect: (selection: ChartSelection) => void;
};

export function TraitsChart({ data, onSelect }: Props) {
  const { i18n, t } = useTranslation();

  return (
    <div className={css["chart-container"]}>
      <h4 className={css["chart-title"]}>{t("common.trait", { count: 2 })}</h4>
      <Scroller className={css["table-container"]} type="auto">
        <table className={css["table"]}>
          <thead>
            <tr>
              <th className={css["trait-chart-column-trait"]}>
                {t("common.trait", { count: 1 })}
              </th>
              <th className={css["trait-chart-column-count"]}>
                {t("deck.tools.count")}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((trait) => {
              const name = i18n.exists(`common.traits.${trait.x}`)
                ? t(`common.traits.${trait.x}`)
                : trait.x;
              const title = t("deck.tools.trait_modal_title", {
                trait: name,
                count: trait.y,
              });

              return (
                <tr key={trait.x}>
                  <td className={css["trait-chart-column-trait"]}>
                    <button
                      className={css["trait-chart-title"]}
                      type="button"
                      onClick={() =>
                        onSelect({ type: "trait", value: trait.x, title })
                      }
                    >
                      <span className={css["trait"]}>{name}</span>
                    </button>
                  </td>
                  <td className={css["trait-chart-column-count"]}>{trait.y}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Scroller>
    </div>
  );
}
