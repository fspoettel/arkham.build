import type { Card, Recommendation } from "@/store/services/queries.types";
import { getCardColor } from "@/utils/card-utils";
import { cx } from "@/utils/cx";
import { DefaultTooltip } from "../ui/tooltip";
import css from "./card-recommender.module.css";

export type RecommendationBarProps = {
  card: Card;
  recommendations: Record<string, Recommendation>;
  investigator: string;
  deckCount: number;
};

export function RecommendationBar(props: RecommendationBarProps) {
  const recData = props.recommendations[props.card.code];
  const recommendation = recData.recommendation;
  const wholeRec = Math.floor(recommendation);

  const paddingFor = (wholeRec: number) => {
    if (wholeRec === 0) {
      return css["label-padding-0"];
    }
    if (wholeRec < 10) {
      return css["label-padding-1digit"];
    }
    if (wholeRec < 100) {
      return css["label-padding-2digit"];
    }
    return css["label-padding-3digit"];
  };

  return (
    <div className={cx(css["recommendation-bar-container"])}>
      <DefaultTooltip
        tooltip={recData.explanation}
        options={{ placement: "bottom" }}
      >
        <div
          className={cx(css["recommendation-bar"], getCardColor(props.card))}
          style={{ width: `${Math.max(0, recommendation)}%` }}
        >
          <span className={paddingFor(wholeRec)}>{wholeRec}%</span>
        </div>
      </DefaultTooltip>
    </div>
  );
}
