import { CardBack } from "@/components/card/card-back";
import { CardContainer } from "@/components/card/card-container";
import { CardFace } from "@/components/card/card-face";
import { useStore } from "@/store";
import {
  selectDeckCreateInvestigatorBack,
  selectDeckCreateInvestigatorFront,
} from "@/store/selectors/deck-create";

import css from "./deck-create.module.css";

export function DeckCreateInvestigator() {
  const front = useStore(selectDeckCreateInvestigatorFront);
  const back = useStore(selectDeckCreateInvestigatorBack);

  return (
    <div className={css["cards"]}>
      <CardContainer size="full">
        <CardFace resolvedCard={front} size="full" />
        <CardBack card={back.card} size="full" />
      </CardContainer>
    </div>
  );
}
