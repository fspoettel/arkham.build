import { beforeAll, describe, expect, it } from "vitest";
import type { StoreApi } from "zustand";

import deckCustomizable from "@/test/fixtures/decks/customizable.json";
import deckSizeAllSpecials from "@/test/fixtures/decks/deck_size_all_specials.json";
import deckSizeParallelAgnes from "@/test/fixtures/decks/deck_size_parallel_agnes.json";
import deckExtraSlots from "@/test/fixtures/decks/extra_slots.json";
import deckFactionSelected from "@/test/fixtures/decks/faction_select.json";
import deckInvestigatorOriginal from "@/test/fixtures/decks/investigator_original.json";
import deckInvestigatorParallelBack from "@/test/fixtures/decks/investigator_parallel_back.json";
import deckInvestigatorParallelBoth from "@/test/fixtures/decks/investigator_parallel_both.json";
import deckInvestigatorParallelFront from "@/test/fixtures/decks/investigator_parallel_front.json";
import deckInvestigatorReplacements from "@/test/fixtures/decks/investigator_replacement.json";
import deckMultiFactionSelected from "@/test/fixtures/decks/multi_faction_select.json";
import deckXpRequired from "@/test/fixtures/decks/xp_required.json";
import { getMockStore } from "@/test/get-mock-store";

import type { StoreState } from "../slices";
import { resolveDeck } from "./deck-resolver";

// TODO: define and test revised core resolution.
describe("resolveDeck", () => {
  let store: StoreApi<StoreState>;

  beforeAll(async () => {
    store = await getMockStore();
  });

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

    it("normalizes meta.alternate_* to the base card", () => {
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

    it("normalizes alt art investigator_code to the base card", () => {
      const { metadata, lookupTables } = store.getState();
      const deck = deckCustomizable;
      const resolved = resolveDeck(metadata, lookupTables, deck, true);
      expect(deck.investigator_code).toEqual("98010");
      expect(resolved.investigatorFront.card.code).toEqual("05001");
    });
  });

  describe("deck building", () => {
    it("parses selected faction if defined", () => {
      const { metadata, lookupTables } = store.getState();
      const deck = deckFactionSelected;
      const resolved = resolveDeck(metadata, lookupTables, deck, false);
      expect(resolved.selections).toMatchInlineSnapshot(`
        {
          "Secondary Class": {
            "options": [
              "guardian",
              "seeker",
              "survivor",
            ],
            "type": "faction",
            "value": "survivor",
          },
        }
      `);
    });

    it("parses multi faction selects if defined", () => {
      const { metadata, lookupTables } = store.getState();
      const deck = deckMultiFactionSelected;
      const resolved = resolveDeck(metadata, lookupTables, deck, false);
      expect(resolved.selections).toMatchInlineSnapshot(`
        {
          "faction_1": {
            "options": [
              "guardian",
              "seeker",
              "rogue",
              "mystic",
              "survivor",
            ],
            "type": "faction",
            "value": "guardian",
          },
          "faction_2": {
            "options": [
              "guardian",
              "seeker",
              "rogue",
              "mystic",
              "survivor",
            ],
            "type": "faction",
            "value": "survivor",
          },
        }
      `);
    });

    it("considers parallel back for deckbuilding", () => {
      const { metadata, lookupTables } = store.getState();

      // parallel wendy deck with "both" selected.
      const deck = deckInvestigatorParallelBack;
      const resolved = resolveDeck(metadata, lookupTables, deck, true);

      expect(resolved.selections).toMatchInlineSnapshot(`
        {
          "Trait Choice": {
            "options": [
              {
                "id": "blessed",
                "level": {
                  "max": 5,
                  "min": 0,
                },
                "name": "Blessed",
                "trait": [
                  "blessed",
                ],
              },
              {
                "id": "cursed",
                "level": {
                  "max": 5,
                  "min": 0,
                },
                "name": "Cursed",
                "trait": [
                  "cursed",
                ],
              },
              {
                "id": "both",
                "level": {
                  "max": 5,
                  "min": 0,
                },
                "name": "Blessed and Cursed",
                "size": 5,
                "trait": [
                  "blessed",
                  "cursed",
                ],
              },
            ],
            "type": "option",
            "value": {
              "id": "both",
              "level": {
                "max": 5,
                "min": 0,
              },
              "name": "Blessed and Cursed",
              "size": 5,
              "trait": [
                "blessed",
                "cursed",
              ],
            },
          },
        }
      `);
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

  describe("customizable", () => {
    it("parses card customizations if present", () => {
      const { metadata, lookupTables } = store.getState();
      const deck = deckCustomizable;
      const resolved = resolveDeck(metadata, lookupTables, deck, true);
      expect(resolved.customizations).toMatchInlineSnapshot(`
        {
          "09021": {
            "0": {
              "choices": "",
              "index": 0,
              "unlocked": true,
              "xpSpent": 1,
            },
            "1": {
              "choices": "",
              "index": 1,
              "unlocked": false,
              "xpSpent": 1,
            },
            "2": {
              "choices": "",
              "index": 2,
              "unlocked": true,
              "xpSpent": 2,
            },
            "3": {
              "choices": "",
              "index": 3,
              "unlocked": true,
              "xpSpent": 2,
            },
            "4": {
              "choices": "",
              "index": 4,
              "unlocked": true,
              "xpSpent": 2,
            },
            "5": {
              "choices": "",
              "index": 5,
              "unlocked": false,
              "xpSpent": 0,
            },
          },
          "09022": {
            "0": {
              "choices": "",
              "index": 0,
              "unlocked": true,
              "xpSpent": 1,
            },
            "1": {
              "choices": "",
              "index": 1,
              "unlocked": true,
              "xpSpent": 1,
            },
          },
          "09040": {
            "0": {
              "choices": "",
              "index": 0,
              "unlocked": true,
              "xpSpent": 1,
            },
            "1": {
              "choices": "",
              "index": 1,
              "unlocked": true,
              "xpSpent": 1,
            },
            "4": {
              "choices": "",
              "index": 4,
              "unlocked": true,
              "xpSpent": 2,
            },
            "5": {
              "choices": "",
              "index": 5,
              "unlocked": true,
              "xpSpent": 4,
            },
            "6": {
              "choices": "",
              "index": 6,
              "unlocked": true,
              "xpSpent": 5,
            },
          },
          "09041": {
            "1": {
              "choices": "",
              "index": 1,
              "unlocked": true,
              "xpSpent": 1,
            },
            "5": {
              "choices": "",
              "index": 5,
              "unlocked": true,
              "xpSpent": 2,
            },
          },
          "09042": {
            "0": {
              "choices": "07159",
              "index": 0,
              "unlocked": true,
              "xpSpent": 0,
            },
            "2": {
              "choices": "",
              "index": 2,
              "unlocked": true,
              "xpSpent": 1,
            },
            "4": {
              "choices": "07159^01031",
              "index": 4,
              "unlocked": true,
              "xpSpent": 2,
            },
          },
          "09060": {
            "0": {
              "choices": "Innate",
              "index": 0,
              "unlocked": true,
              "xpSpent": 0,
            },
            "1": {
              "choices": "",
              "index": 1,
              "unlocked": false,
              "xpSpent": 0,
            },
            "2": {
              "choices": "Illicit",
              "index": 2,
              "unlocked": true,
              "xpSpent": 2,
            },
            "3": {
              "choices": "",
              "index": 3,
              "unlocked": false,
              "xpSpent": 0,
            },
            "5": {
              "choices": "",
              "index": 5,
              "unlocked": true,
              "xpSpent": 2,
            },
          },
          "09061": {
            "6": {
              "choices": "",
              "index": 6,
              "unlocked": true,
              "xpSpent": 3,
            },
          },
          "09079": {
            "0": {
              "choices": "willpower",
              "index": 0,
              "unlocked": true,
              "xpSpent": 0,
            },
            "1": {
              "choices": "",
              "index": 1,
              "unlocked": true,
              "xpSpent": 1,
            },
            "4": {
              "choices": "intellect",
              "index": 4,
              "unlocked": true,
              "xpSpent": 2,
            },
            "5": {
              "choices": "agility",
              "index": 5,
              "unlocked": true,
              "xpSpent": 3,
            },
          },
          "09080": {
            "1": {
              "choices": "",
              "index": 1,
              "unlocked": true,
              "xpSpent": 1,
            },
            "3": {
              "choices": "",
              "index": 3,
              "unlocked": false,
              "xpSpent": 0,
            },
            "5": {
              "choices": "0",
              "index": 5,
              "unlocked": true,
              "xpSpent": 2,
            },
          },
          "09081": {
            "1": {
              "choices": "",
              "index": 1,
              "unlocked": true,
              "xpSpent": 1,
            },
            "7": {
              "choices": "",
              "index": 7,
              "unlocked": true,
              "xpSpent": 3,
            },
          },
          "09101": {
            "0": {
              "choices": "Innate^Expert",
              "index": 0,
              "unlocked": true,
              "xpSpent": 0,
            },
            "1": {
              "choices": "Practiced",
              "index": 1,
              "unlocked": true,
              "xpSpent": 1,
            },
            "2": {
              "choices": "",
              "index": 2,
              "unlocked": false,
              "xpSpent": 0,
            },
          },
        }
      `);
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

      it("counts customizable experience", () => {
        const { metadata, lookupTables } = store.getState();
        const deck = deckCustomizable;
        const resolved = resolveDeck(metadata, lookupTables, deck, true);
        expect(resolved.stats).toMatchObject({
          xpRequired: 47,
        });
      });
    });
  });
});
