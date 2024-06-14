import { Redirect } from "wouter";

import { CardBack } from "@/components/card/card-back";
import { CardContainer } from "@/components/card/card-container";
import { CardFront } from "@/components/card/card-front";
import { useStore } from "@/store";
import {
  selectDeckCreateInvestigator,
  selectDeckCreateInvestigatorBack,
  selectDeckCreateInvestigatorFront,
} from "@/store/selectors/deck-create";

import css from "./deck-create.module.css";

export function DeckCreateInvestigator() {
  const front = useStore(selectDeckCreateInvestigatorFront);
  const back = useStore(selectDeckCreateInvestigatorBack);

  const investigator = useStore(selectDeckCreateInvestigator);

  const canonicalCode =
    investigator.card.duplicate_of_code ?? investigator.card.alternate_of_code;

  if (canonicalCode) {
    const href = `/create/${canonicalCode}`;
    return <Redirect replace to={href} />;
  }

  return (
    <div className={css["cards"]}>
      <CardContainer size="full">
        <CardFront resolvedCard={front} size="full" />
        <CardBack card={back.card} size="full" />
      </CardContainer>
    </div>
  );
}
