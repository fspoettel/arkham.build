import {
  cardToApiFormat,
  cycleToApiFormat,
  packToApiFormat,
} from "@/utils/arkhamdb-json-format";
import i18n from "@/utils/i18n";
import { isEmpty } from "@/utils/is-empty";
import { time, timeEnd } from "@/utils/time";
import { createSelector } from "reselect";
import { ownedCardCount } from "../lib/card-ownership";
import { createLookupTables } from "../lib/lookup-tables";
import type { ResolvedDeck } from "../lib/types";
import type { Card, EncounterSet } from "../services/queries.types";
import type { StoreState } from "../slices";

export const selectMetadata = createSelector(
  (state: StoreState) => state.metadata,
  (state: StoreState) => state.customData.projects,
  (metadata, customContentProjects) => {
    const projects = Object.values(customContentProjects);

    if (isEmpty(projects)) return metadata;

    time("select_custom_data");

    const meta = structuredClone(metadata);

    for (const project of projects) {
      const encounterSets = project.data.encounter_sets.reduce(
        (acc, curr) => {
          acc[curr.code] = curr as EncounterSet;
          return acc;
        },
        {} as Record<string, EncounterSet>,
      );

      if (!meta.cycles[project.meta.code]) {
        meta.cycles[project.meta.code] = cycleToApiFormat({
          code: project.meta.code,
          name: project.meta.name,
          position: 0,
          official: false,
        });
      }

      for (const pack of project.data.packs) {
        meta.packs[pack.code] = packToApiFormat({
          ...pack,
          cycle_code: project.meta.code,
          official: false,
        });
      }

      for (const card of project.data.cards) {
        meta.cards[card.code] = cardToApiFormat({ ...card, official: false });
        if (card.encounter_code && card.encounter_code in encounterSets) {
          encounterSets[card.encounter_code].pack_code = card.pack_code;
        }
      }

      for (const encounterSet of Object.values(encounterSets)) {
        if (encounterSet.pack_code) {
          meta.encounterSets[encounterSet.code] = encounterSet;
        }
      }
    }

    timeEnd("select_custom_data");

    return meta;
  },
);

export const selectLookupTables = createSelector(
  selectMetadata,
  (state: StoreState) => state.settings,
  (metadata, settings) => {
    return createLookupTables(metadata, settings);
  },
);

export const selectClientId = (state: StoreState) => {
  return state.app.clientId;
};

export const selectIsInitialized = (state: StoreState) => {
  return state.ui.initialized;
};

export const selectCanCheckOwnership = (state: StoreState) =>
  !state.settings.showAllCards;

export const selectCardOwnedCount = createSelector(
  selectMetadata,
  selectLookupTables,
  (state: StoreState) => state.settings,
  (metadata, lookupTables, settings) => {
    const { collection, showAllCards } = settings;

    return (card: Card) => {
      return ownedCardCount(
        card,
        metadata,
        lookupTables,
        collection,
        showAllCards,
      );
    };
  },
);

export const selectConnectionLock = createSelector(
  (state: StoreState) => state.remoting,
  (remoting) => {
    return remoting.sync || remoting.arkhamdb
      ? i18n.t("settings.connections.lock", { provider: "ArkhamDB" })
      : undefined;
  },
);

export const selectConnectionLockForDeck = createSelector(
  selectConnectionLock,
  (_: StoreState, deck: ResolvedDeck) => deck,
  (remoting, deck) => {
    return remoting && deck.source === "arkhamdb" ? remoting : undefined;
  },
);

export const selectBackCard = createSelector(
  selectMetadata,
  selectLookupTables,
  (_: StoreState, code: string) => code,
  (metadata, lookupTables, code) => {
    const card = metadata.cards[code];
    if (!card) return undefined;

    if (card.back_link_id) {
      return metadata.cards[card.back_link_id];
    }

    if (card.hidden) {
      const backCode = Object.keys(
        lookupTables.relations.fronts[code] ?? {},
      ).at(0);

      return backCode ? metadata.cards[backCode] : undefined;
    }

    return undefined;
  },
);

export const selectLocaleSortingCollator = createSelector(
  (state: StoreState) => state.settings,
  (settings) => {
    return new Intl.Collator(settings.locale, {
      ignorePunctuation: settings.sortIgnorePunctuation,
      sensitivity: "base",
      usage: "sort",
    });
  },
);
