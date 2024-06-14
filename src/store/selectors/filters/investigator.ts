import { createSelector } from "reselect";

import { Card } from "@/store/services/types";
import { StoreState } from "@/store/slices";
import { PropertiesFilter } from "@/store/slices/filters/types";
import { LookupTables } from "@/store/slices/lookup-tables/types";
import { capitalize } from "@/utils/capitalize";
import { Filter, and, not, or } from "@/utils/fp";

import { filterActions } from "./action";
import { filterUses } from "./assets";
import { filterFactions } from "./faction";
import { filterCardLevel } from "./level";
import { filterProperties } from "./properties";
import { filterSubtypes } from "./subtype";
import { filterTraits } from "./traits";
import { filterType } from "./type";

function filterRequired(
  code: string,
  relationsTable: LookupTables["relations"],
) {
  return (card: Card) =>
    !!relationsTable.advanced[code]?.[card.code] ||
    !!relationsTable.requiredCards[code]?.[card.code] ||
    !!relationsTable.parallelCards[code]?.[card.code] ||
    !!relationsTable.replacement[code]?.[card.code];
}

export const selectInvestigatorWeaknessFilter = createSelector(
  (state: StoreState) => state.metadata.cards,
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.filters.player.investigator.value,
  (metadata, lookupTables, cardCode) => {
    if (!cardCode) return undefined;

    const card = metadata[cardCode];
    if (!card) return undefined;

    // normalize parallel investigators to root for lookups.
    const code = card.alternate_of_code ?? cardCode;

    const ors: Filter[] = [
      filterRequired(code, lookupTables.relations),
      filterSubtypes({ basicweakness: true }),
    ];

    return or(ors);
  },
);

export const selectInvestigatorFilter = createSelector(
  (state: StoreState) => state.metadata.cards,
  (state: StoreState) => state.lookupTables,
  (state: StoreState) => state.filters.player.investigator.value,
  (metadata, lookupTables, cardCode) => {
    if (!cardCode) return undefined;

    const card = metadata[cardCode];
    if (!card) return undefined;

    const requirements = card.deck_requirements?.card;
    const options = card.deck_options;

    if (!requirements || !options) {
      throw new TypeError(`${cardCode} is not an investigator.`);
    }

    // normalize parallel investigators to root for lookups.
    const code = card.alternate_of_code ?? cardCode;

    const ors: Filter[] = [filterRequired(code, lookupTables.relations)];

    const ands: Filter[] = [];

    for (const option of options) {
      // unknown rules or duplicate rules.
      if (
        option.deck_size_select ||
        option.tag?.includes("st") ||
        option.tag?.includes("uc")
      ) {
        continue;
      }

      const optionFilter = [];

      let filterCount = 0;

      if (option.not) {
        filterCount += 1;
      }

      if (option.faction) {
        filterCount += 1;
        optionFilter.push(filterFactions(option.faction));
      }

      if (option.faction_select) {
        filterCount += 1;
        optionFilter.push(filterFactions(option.faction_select));
      }

      if (option.level) {
        filterCount += 1;
        optionFilter.push(
          filterCardLevel([option.level.min, option.level.max]),
        );
      }

      if (option.limit) {
        filterCount += 1;
      }

      if (option.trait) {
        filterCount += 1;
        // traits are stored lowercased for whatever reason.
        const traits = option.trait.reduce(
          (acc, curr) => ({
            ...acc,
            [`${capitalize(curr)}`]: true,
          }),
          {},
        );

        optionFilter.push(filterTraits(traits, lookupTables.traits));
      }

      if (option.uses) {
        filterCount += 1;
        optionFilter.push(filterUses(option.uses, lookupTables.uses));
      }

      if (option.type) {
        filterCount += 1;

        const types = option.type.reduce(
          (acc, curr) => ({
            ...acc,
            [curr]: true,
          }),
          {},
        );

        optionFilter.push(filterType(types));
      }

      // parallel wendy
      if (option.option_select) {
        const selectFilters: Filter[] = [];

        option.option_select.forEach((select) => {
          const optionSelectFilters: Filter[] = [];

          if (select.level) {
            optionSelectFilters.push(
              filterCardLevel([select.level.min, select.level.max]),
            );
          }

          if (select.trait) {
            const traits = select.trait.reduce(
              (acc, curr) => ({
                ...acc,
                [`${capitalize(curr)}`]: true,
              }),
              {},
            );

            optionSelectFilters.push(filterTraits(traits, lookupTables.traits));
          }

          selectFilters.push(and(optionSelectFilters));
        });

        filterCount += selectFilters.length;
        optionFilter.push(or(selectFilters));
      }

      // special case: allessandra
      if (option.text && option.text.some((s) => s.includes("Parley"))) {
        filterCount += 1;
        optionFilter.push(
          filterActions({ parley: true }, lookupTables["actions"]),
        );
      }

      // carolyn fern
      if (option.tag?.includes("hh")) {
        filterCount += 1;
        optionFilter.push(
          filterProperties(
            { heals_horror: true } as PropertiesFilter,
            lookupTables,
          ),
        );
      }

      // vincent
      if (option.tag?.includes("hd")) {
        filterCount += 1;
        optionFilter.push(
          filterProperties(
            { heals_damage: true } as PropertiesFilter,
            lookupTables,
          ),
        );
      }

      if (filterCount > 1) {
        const filter = and(optionFilter);

        if (option.not) {
          ands.push(not(filter));
        } else {
          ors.push(filter);
        }
      } else {
        console.debug(`unknown deck requirement`, option);
      }
    }

    return and([or(ors), ...ands]);
  },
);

export const selectInvestigators = (state: StoreState) => {
  const investigatorTable = state.lookupTables.typeCode["investigator"];

  const investigators = Object.keys(investigatorTable).reduce((acc, code) => {
    const card = state.metadata.cards[code];

    if (!card.encounter_code && (!card.alt_art_investigator || card.parallel)) {
      acc.push(card);
    }

    return acc;
  }, [] as Card[]);

  investigators.sort((a, b) => a.real_name.localeCompare(b.real_name));

  return investigators;
};

export const selectActiveInvestigator = (state: StoreState) =>
  state.filters.player.investigator.value;
