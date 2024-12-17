import { ListCard } from "@/components/list-card/list-card";
import { Details } from "@/components/ui/details";
import { useStore } from "@/store";
import {
  filterAlternates,
  filterEncounterCards,
  filterInvestigatorAccess,
  filterInvestigatorWeaknessAccess,
} from "@/store/lib/filtering";
import { makeSortFunction } from "@/store/lib/sorting";
import type { Card } from "@/store/services/queries.types";
import type { StoreState } from "@/store/slices";
import { not, or } from "@/utils/fp";
import { createSelector } from "reselect";

type Props = {
  card: Card;
};

const selectInvestigators = createSelector(
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.metadata,
  (_: StoreState, card: Card) => card,
  (lookupTables, metadata, card) => {
    const investigatorCodes = Object.keys(
      lookupTables.typeCode["investigator"],
    );

    const cards = investigatorCodes
      .map((code) => metadata.cards[code])
      .filter((investigator) => {
        const isValidInvestigator =
          not(filterEncounterCards)(investigator) &&
          filterAlternates(investigator);

        if (!isValidInvestigator) return false;

        const access = filterInvestigatorAccess(investigator);
        if (!access) return false;

        const weaknessAccess = filterInvestigatorWeaknessAccess(
          investigator,
          lookupTables,
        );

        return or([access, weaknessAccess])(card);
      });

    const sorting = makeSortFunction(["name", "cycle"], metadata);

    return cards.sort(sorting);
  },
);

export function UsableBy(props: Props) {
  const investigators = useStore((state) =>
    selectInvestigators(state, props.card),
  );

  return (
    <Details
      data-testid="usable-by"
      iconClosed={<i className="icon-per_investigator" />}
      title="Who can use this?"
      scrollHeight="24rem"
    >
      <ol>
        {investigators.map((card) => (
          <ListCard as="li" card={card} key={card.code} size="investigator" />
        ))}
      </ol>
    </Details>
  );
}
