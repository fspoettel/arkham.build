import { describe, expect, it } from "vitest";

import deckSizeAllSpecials from "@/test/fixtures/decks/deck_size_all_specials.json";
import deckSizeParallelAgnes from "@/test/fixtures/decks/deck_size_parallel_agnes.json";
import deckExtraSlots from "@/test/fixtures/decks/extra_slots.json";
import deckFactionSelected from "@/test/fixtures/decks/faction_select.json";
import deckInvestigatorOriginal from "@/test/fixtures/decks/investigator_original.json";
import deckInvestigatorParallelBack from "@/test/fixtures/decks/investigator_parallel_back.json";
import deckInvestigatorParallelBoth from "@/test/fixtures/decks/investigator_parallel_both.json";
import deckInvestigatorParallelFront from "@/test/fixtures/decks/investigator_parallel_front.json";
import deckInvestigatorReplacements from "@/test/fixtures/decks/investigator_replacement.json";
import deckXpRequired from "@/test/fixtures/decks/xp_required.json";
import { getMockStore } from "@/test/get-mock-store";

import type { DeckOption } from "../services/types";
import { resolveDeck } from "./deck-resolver";

describe("resolveDeck", async () => {
  const store = await getMockStore();

  describe("alternate investigators", () => {
    it("resolves originals", () => {
      const { metadata, lookupTables } = store.getState();
      const deck = deckInvestigatorOriginal;
      const resolved = resolveDeck(metadata, lookupTables, deck, true);
      expect(resolved.investigatorFront.card.code).toEqual(
        deck.investigator_code,
      );
      expect(resolved.investigatorBack.card.code).toEqual(
        deck.investigator_code,
      );
    });

    it("resolves parallel front", () => {
      const { metadata, lookupTables } = store.getState();
      const deck = deckInvestigatorParallelFront;
      const resolved = resolveDeck(metadata, lookupTables, deck, true);
      expect(resolved.investigatorFront.card.code).toEqual(
        resolved.metaParsed.alternate_front,
      );
      expect(resolved.investigatorBack.card.code).toEqual(
        deck.investigator_code,
      );
    });

    it("resolves parallel back", () => {
      const { metadata, lookupTables } = store.getState();
      const deck = deckInvestigatorParallelBack;
      const resolved = resolveDeck(metadata, lookupTables, deck, true);
      expect(resolved.investigatorFront.card.code).toEqual(
        deck.investigator_code,
      );
      expect(resolved.investigatorBack.card.code).toEqual(
        resolved.metaParsed.alternate_back,
      );
    });

    it("resolves parallel front and back", () => {
      const { metadata, lookupTables } = store.getState();
      const deck = deckInvestigatorParallelBoth;
      const resolved = resolveDeck(metadata, lookupTables, deck, true);

      expect(resolved.investigatorFront.card.code).toEqual(
        resolved.metaParsed.alternate_front,
      );

      expect(resolved.investigatorBack.card.code).toEqual(
        resolved.metaParsed.alternate_back,
      );
    });

    it("normalizes replacements to base cards", () => {
      const { metadata, lookupTables } = store.getState();
      const deck = deckInvestigatorReplacements;
      const resolved = resolveDeck(metadata, lookupTables, deck, true);

      expect(resolved.investigatorFront.card.code).toEqual(
        resolved.investigator_code,
      );

      expect(resolved.investigatorBack.card.code).toEqual(
        resolved.investigator_code,
      );
    });
  });

  describe("deck building", () => {
    it("parses selected faction if defined", () => {
      const { metadata, lookupTables } = store.getState();
      const deck = deckFactionSelected;
      const resolved = resolveDeck(metadata, lookupTables, deck, false);
      expect(resolved.factionSelect).toMatchObject({
        selection: "survivor",
      });
    });

    it("considers parallel back for deckbuilding", () => {
      const { metadata, lookupTables } = store.getState();

      // parallel wendy deck with "both" selected.
      const deck = deckInvestigatorParallelBack;
      const resolved = resolveDeck(metadata, lookupTables, deck, true);

      const optionSelect = resolved.investigatorBack.card.deck_options?.find(
        (x) => x.option_select,
      ) as DeckOption;

      expect(resolved.optionSelect).toMatchObject({
        name: optionSelect.name,
        selection: optionSelect.option_select?.find((x) => x.id === "both")
          ?.name,
      });
    });
  });

  describe("deck size", () => {
    it("sums up total card count, excluding side deck", () => {
      const { metadata, lookupTables } = store.getState();
      const deck = deckSizeAllSpecials;
      const resolved = resolveDeck(metadata, lookupTables, deck, true);
      expect(resolved.stats.deckSizeTotal).toEqual(15);
    });

    it("calculates player card count correctly when replacement specials are used", () => {
      const { metadata, lookupTables } = store.getState();
      const deck = deckSizeAllSpecials;
      const resolved = resolveDeck(metadata, lookupTables, deck, true);
      expect(resolved.stats).toMatchObject({
        deckSize: 1,
        deckSizeTotal: 15,
      });
    });

    it("calculates player card count correctly for parallel agnes", () => {
      const { metadata, lookupTables } = store.getState();
      const deck = deckSizeParallelAgnes;
      const resolved = resolveDeck(metadata, lookupTables, deck, true);
      expect(resolved.stats).toMatchObject({
        deckSize: 2,
        deckSizeTotal: 9,
      });
    });
  });

  describe("experience", () => {
    it("calculates experience correctly (exceptional, taboos)", () => {
      const { metadata, lookupTables } = store.getState();
      const deck = deckXpRequired;
      const resolved = resolveDeck(metadata, lookupTables, deck, true);
      expect(resolved.stats).toMatchObject({
        xpRequired: 25,
      });
    });
  });

  describe("extra deck", () => {
    it("parses the extra deck block", () => {
      const { metadata, lookupTables } = store.getState();
      const deck = deckExtraSlots;
      const resolved = resolveDeck(metadata, lookupTables, deck, true);
      expect(resolved.extraSlots).toMatchInlineSnapshot(`
        {
          "01018": 1,
          "01063": 1,
          "02020": 1,
          "03198": 1,
          "05155": 1,
          "06162": 1,
          "07111": 1,
          "08083": 1,
          "60410": 1,
          "90053": 1,
        }
      `);
    });

    it("adds the extra cards to the total deck size", () => {
      const { metadata, lookupTables } = store.getState();
      const deck = deckExtraSlots;
      const resolved = resolveDeck(metadata, lookupTables, deck, true);
      expect(resolved.stats.deckSizeTotal).toEqual(45);
    });
  });
});
