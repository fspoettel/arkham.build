import { CardBack } from "@/components/card/card-back";
import { CardContainer } from "@/components/card/card-container";
import { CardFace } from "@/components/card/card-face";
import { useStore } from "@/store";
import { selectDeckCreateInvestigators } from "@/store/selectors/deck-create";
import css from "./deck-create.module.css";

export function DeckCreateInvestigator() {
  const { back, front } = useStore(selectDeckCreateInvestigators);

  return (
    <div className={css["cards"]}>
      <CardContainer size="full">
        <CardFace resolvedCard={front} size="full" />
        <CardBack card={back.card} size="full" />
      </CardContainer>
    </div>
  );
}
