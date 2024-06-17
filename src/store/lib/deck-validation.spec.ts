import { beforeAll, describe, expect, it } from "vitest";
import type { StoreApi } from "zustand";

import accessCustomizableValid from "@/test/fixtures/decks/validation/access_customizable.json";
import accessCustomizableInvalid from "@/test/fixtures/decks/validation/access_customizable_invalid.json";
import atleastAncestralKnowledge from "@/test/fixtures/decks/validation/atleast_ancestral_knowledge.json";
import atleastAncestralKnowledgeInvalid from "@/test/fixtures/decks/validation/atleast_ancestral_knowledge_invalid.json";
import atleastFactions from "@/test/fixtures/decks/validation/atleast_factions.json";
import atleastFactionsInvalid from "@/test/fixtures/decks/validation/atleast_factions_invalid.json";
import baseCase from "@/test/fixtures/decks/validation/base_case.json";
import covenantValid from "@/test/fixtures/decks/validation/covenant.json";
import covenantInvalid from "@/test/fixtures/decks/validation/covenant_invalid.json";
import extraSlotsForbidden from "@/test/fixtures/decks/validation/extra_slots_forbidden.json";
import extraSlotsTooFewCards from "@/test/fixtures/decks/validation/extra_slots_too_few_cards.json";
import extraSlotsTooManyCards from "@/test/fixtures/decks/validation/extra_slots_too_many_cards.json";
import extraSlotsTooManyCopies from "@/test/fixtures/decks/validation/extra_slots_too_many_copies.json";
import extraSlotsValid from "@/test/fixtures/decks/validation/extra_slots_valid.json";
import forcedLearning from "@/test/fixtures/decks/validation/forced_learning.json";
import limitCarolyn from "@/test/fixtures/decks/validation/limit_carolyn.json";
import limitCarolynInvalid from "@/test/fixtures/decks/validation/limit_carolyn_invalid.json";
import limitCarolynVersatile from "@/test/fixtures/decks/validation/limit_carolyn_versatile.json";
import limitCarolynVersatileInvalid from "@/test/fixtures/decks/validation/limit_carolyn_versatile_invalid.json";
import limitDunwich from "@/test/fixtures/decks/validation/limit_dunwich.json";
import limitDunwichInvalid from "@/test/fixtures/decks/validation/limit_dunwich_invalid.json";
import limitFactionSelect from "@/test/fixtures/decks/validation/limit_faction_select.json";
import limitFactionSelectInvalid from "@/test/fixtures/decks/validation/limit_faction_select_invalid.json";
import limitOnYourOwn from "@/test/fixtures/decks/validation/limit_onyourown.json";
import limitOnYourOwnInvalid from "@/test/fixtures/decks/validation/limit_onyourown_invalid.json";
import limitTrait from "@/test/fixtures/decks/validation/limit_trait.json";
import limitTraitInvalid from "@/test/fixtures/decks/validation/limit_trait_invalid.json";
import limitVersatile from "@/test/fixtures/decks/validation/limit_versatile.json";
import limitVersatileInvalid from "@/test/fixtures/decks/validation/limit_versatile_invalid.json";
import limitTooManyByName from "@/test/fixtures/decks/validation/limits_too_many_by_name.json";
import mandyValid from "@/test/fixtures/decks/validation/mandy.json";
import mandySignatureCountInvalid from "@/test/fixtures/decks/validation/mandy_signature_count_invalid.json";
import mandyTabooValid from "@/test/fixtures/decks/validation/mandy_taboo.json";
import mandyTooFewCards from "@/test/fixtures/decks/validation/mandy_too_few_cards.json";
import mandyTooManyCards from "@/test/fixtures/decks/validation/mandy_too_many_cards.json";
import parallelAgnesValid from "@/test/fixtures/decks/validation/parallel_agnes.json";
import parallelWendy from "@/test/fixtures/decks/validation/parallel_wendy.json";
import parallelWendyInvalid from "@/test/fixtures/decks/validation/parallel_wendy_invalid.json";
import requiredAdvanced from "@/test/fixtures/decks/validation/required_advanced.json";
import requiredAdvancedInvalid from "@/test/fixtures/decks/validation/required_advanced_invalid.json";
import requiredAdvancedOnlySignature from "@/test/fixtures/decks/validation/required_advanced_only_signature.json";
import requiredAll from "@/test/fixtures/decks/validation/required_all.json";
import requiredMissingSignature from "@/test/fixtures/decks/validation/required_missing_signature.json";
import requiredMissingWeakness from "@/test/fixtures/decks/validation/required_missing_weakness.json";
import requiredQuantity from "@/test/fixtures/decks/validation/required_quantity.json";
import requiredQuantityInvalid from "@/test/fixtures/decks/validation/required_quantity_invalid.json";
import requiredReplacements from "@/test/fixtures/decks/validation/required_replacements.json";
import requiredReplacementsInAddition from "@/test/fixtures/decks/validation/required_replacements_in_addition.json";
import requiredReplacementsInvalid from "@/test/fixtures/decks/validation/required_replacements_invalid.json";
import requiredSilasReplacement from "@/test/fixtures/decks/validation/required_silas_replacement.json";
import requiredSilasStandard from "@/test/fixtures/decks/validation/required_silas_standard.json";
import tooFew from "@/test/fixtures/decks/validation/too_few_cards.json";
import tooMany from "@/test/fixtures/decks/validation/too_many_cards.json";
import tooManyCopies from "@/test/fixtures/decks/validation/too_many_copies.json";
import underworldMarket from "@/test/fixtures/decks/validation/underworld_market.json";
import underworldSupport from "@/test/fixtures/decks/validation/underworld_support.json";
import underworldSupperInvalidDeckLimit from "@/test/fixtures/decks/validation/underworld_support_invalid_deck_limit.json";
import underworldSupportInvalidSize from "@/test/fixtures/decks/validation/underworld_support_invalid_size.json";
import { getMockStore } from "@/test/get-mock-store";

import type { StoreState } from "../slices";
import type { Deck } from "../slices/data.types";
import { validateDeck } from "./deck-validation";
import { resolveDeck } from "./resolve-deck";

function validate(store: StoreApi<StoreState>, deck: Deck) {
  const state = store.getState();
  return validateDeck(
    resolveDeck(state.metadata, state.lookupTables, deck, false),
    state,
  );
}

describe("deck validation", () => {
  let store: StoreApi<StoreState>;

  beforeAll(async () => {
    store = await getMockStore();
  });

  it("handles case: valid base case", () => {
    const result = validate(store, baseCase);
    expect(result.valid).toBeTruthy();
  });

  it("handles case: valid base case, forbidden card with quantity 0", () => {
    const deck = structuredClone(baseCase);
    (deck.slots as Record<string, number>)["01020"] = 0;
    const result = validate(store, deck);
    expect(result.valid).toBeTruthy();
  });

  describe("deck size", () => {
    it("handles case: no deck size selection, too many cards", () => {
      const result = validate(store, tooMany);
      expect(result.valid).toBeFalsy();
      expect(
        result.errors.find((x) => x.type === "TOO_MANY_CARDS"),
      ).toBeDefined();
    });

    it("handles case: no deck size selection, too few cards", () => {
      const result = validate(store, tooFew);
      expect(result.valid).toBeFalsy();
      expect(result.errors).toMatchInlineSnapshot(`
        [
          {
            "details": {
              "target": "slots",
            },
            "type": "TOO_FEW_CARDS",
          },
        ]
      `);
    });

    it("handles case: deck size selection, correct card count", () => {
      const result = validate(store, mandyValid);
      expect(result.valid).toBeTruthy();
    });

    it("handles case: deck size selection, too many cards", () => {
      const result = validate(store, mandyTooManyCards);
      expect(result.valid).toBeFalsy();
      expect(
        result.errors.find((x) => x.type === "TOO_MANY_CARDS"),
      ).toBeDefined();
    });

    it("handles case: deck size selection, too few cards", () => {
      const result = validate(store, mandyTooFewCards);
      expect(result.valid).toBeFalsy();
      expect(
        result.errors.find((x) => x.type === "TOO_FEW_CARDS"),
      ).toBeDefined();
    });

    it("handles case: taboo mandy, correct card count", () => {
      const result = validate(store, mandyTabooValid);
      expect(result.valid).toBeTruthy();
    });
  });

  describe("card counts", () => {
    it("handles case: too many copies of a card", () => {
      const result = validate(store, tooManyCopies);
      expect(result.valid).toBeFalsy();
      expect(result).toMatchInlineSnapshot(`
        {
          "errors": [
            {
              "details": [
                {
                  "code": "01047",
                  "limit": 2,
                  "quantity": 3,
                  "real_name": ".41 Derringer",
                },
                {
                  "code": "07224",
                  "limit": 1,
                  "quantity": 2,
                  "real_name": ""Lucky" Penny",
                },
              ],
              "type": "INVALID_CARD_COUNT",
            },
          ],
          "valid": false,
        }
      `);
    });

    it("handles case: one covenant", () => {
      const result = validate(store, covenantValid);
      expect(result.valid).toBeTruthy();
    });

    it("handles case: too many covenants", () => {
      const result = validate(store, covenantInvalid);
      expect(result.valid).toBeFalsy();
      expect(result).toMatchInlineSnapshot(`
        {
          "errors": [
            {
              "details": {
                "error": "You cannot have more than one Covenant in your deck.",
              },
              "type": "INVALID_DECK_OPTION",
            },
          ],
          "valid": false,
        }
      `);
    });
  });

  describe("deck requirements", () => {
    it("handles case: missing signature", () => {
      const result = validate(store, requiredMissingSignature);
      expect(result.valid).toBeFalsy();
      expect(result.errors).toMatchInlineSnapshot(`
        [
          {
            "type": "DECK_REQUIREMENTS_NOT_MET",
          },
        ]
      `);
    });

    it("handles case: missing signature weakness", () => {
      const result = validate(store, requiredMissingWeakness);
      expect(result.valid).toBeFalsy();
      expect(result.errors).toMatchInlineSnapshot(`
        [
          {
            "type": "DECK_REQUIREMENTS_NOT_MET",
          },
        ]
      `);
    });

    it("handles case: has replacements, valid", () => {
      const result = validate(store, requiredReplacements);
      expect(result.valid).toBeTruthy();
    });

    it("handles case: has replacements, invalid", () => {
      const result = validate(store, requiredReplacementsInvalid);
      expect(result.valid).toBeFalsy();
      expect(result.errors).toMatchInlineSnapshot(`
        [
          {
            "type": "DECK_REQUIREMENTS_NOT_MET",
          },
        ]
      `);
    });

    it("handles case: has signatures and replacements, valid", () => {
      const result = validate(store, requiredReplacementsInAddition);
      expect(result.valid).toBeTruthy();
    });

    it("handles case: has advanced, valid", () => {
      const result = validate(store, requiredAdvanced);
      expect(result.valid).toBeTruthy();
    });

    it("handles case: has advanced, invalid", () => {
      const result = validate(store, requiredAdvancedInvalid);
      expect(result.valid).toBeFalsy();
      expect(result.errors).toMatchInlineSnapshot(`
        [
          {
            "type": "DECK_REQUIREMENTS_NOT_MET",
          },
        ]
      `);
    });

    it("handles case: has advanced signature only, valid", () => {
      const result = validate(store, requiredAdvancedOnlySignature);
      expect(result.valid).toBeTruthy();
    });

    it("handles case: has all, valid", () => {
      const result = validate(store, requiredAll);
      expect(result.valid).toBeTruthy();
    });

    it("handles case: signature quantity, valid", () => {
      const result = validate(store, requiredQuantity);
      expect(result.valid).toBeTruthy();
    });

    it("handles case: signature quantity, invalid", () => {
      const result = validate(store, requiredQuantityInvalid);
      expect(result.valid).toBeFalsy();
      expect(result.errors).toMatchInlineSnapshot(`
        [
          {
            "details": [
              {
                "code": "89003",
                "limit": 3,
                "quantity": 2,
                "real_name": "Regurgitation",
              },
            ],
            "type": "INVALID_CARD_COUNT",
          },
        ]
      `);
    });

    it("handles case: mandy, too few signatures", () => {
      const result = validate(store, mandySignatureCountInvalid);
      expect(result.valid).toBeFalsy();
      expect(result.errors).toMatchInlineSnapshot(`
        [
          {
            "details": [
              {
                "code": "06008",
                "limit": 2,
                "quantity": 3,
                "real_name": "Occult Evidence",
              },
            ],
            "type": "INVALID_CARD_COUNT",
          },
        ]
      `);
    });

    it("handles case: mandy, too many signatures", () => {
      const deck = mandySignatureCountInvalid;
      deck.slots["06008"] = 1;
      const result = validate(store, mandySignatureCountInvalid);
      expect(result.valid).toBeFalsy();
      expect(result.errors).toMatchInlineSnapshot(`
        [
          {
            "details": [
              {
                "code": "06008",
                "limit": 2,
                "quantity": 1,
                "real_name": "Occult Evidence",
              },
            ],
            "type": "INVALID_CARD_COUNT",
          },
        ]
      `);
    });

    it("handles case: silas (standard)", () => {
      const result = validate(store, requiredSilasStandard);
      expect(result.valid).toBeTruthy();
    });

    it("handles case: silas (replacement)", () => {
      const result = validate(store, requiredSilasReplacement);
      expect(result.valid).toBeTruthy();
    });

    it("handles case: silas (replacement), invalid", () => {
      const deck = requiredSilasReplacement;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (deck.slots as any)["98014"];
      const result = validate(store, requiredSilasReplacement);
      expect(result.valid).toBeFalsy();
      expect(result.errors).toMatchInlineSnapshot(`
        [
          {
            "type": "DECK_REQUIREMENTS_NOT_MET",
          },
        ]
      `);
    });
  });

  describe("investigator access", () => {
    it("handles case: customizable card access, valid", () => {
      const result = validate(store, accessCustomizableValid);
      expect(result.valid).toBeTruthy();
    });

    it("handles case: customizable card access, invalid", () => {
      const result = validate(store, accessCustomizableInvalid);
      expect(result.valid).toBeFalsy();
      expect(result.errors).toMatchInlineSnapshot(`
        [
          {
            "details": [
              {
                "code": "09021",
                "real_name": "Hunter's Armor",
                "target": "slots",
              },
              {
                "code": "09022",
                "real_name": "Runic Axe",
                "target": "slots",
              },
              {
                "code": "09040",
                "real_name": "Alchemical Distillation",
                "target": "slots",
              },
            ],
            "type": "FORBIDDEN",
          },
        ]
      `);
    });
  });

  describe("limit", () => {
    it("handles case: dunwich", () => {
      const result = validate(store, limitDunwich);
      expect(result.valid).toBeTruthy();
    });

    it("handles case: dunwich, invalid", () => {
      const result = validate(store, limitDunwichInvalid);
      expect(result.valid).toBeFalsy();
      expect(result.errors).toMatchInlineSnapshot(`
        [
          {
            "details": {
              "error": "You cannot have more than 5 cards that are not Guardian or Neutral (6 / 5)",
            },
            "type": "INVALID_DECK_OPTION",
          },
        ]
      `);
    });

    it("handles case: faction select", () => {
      const result = validate(store, limitFactionSelect);
      expect(result.valid).toBeTruthy();
    });

    it("handles case: faction select, invalid", () => {
      const result = validate(store, limitFactionSelectInvalid);
      expect(result.valid).toBeFalsy();
      expect(result.errors).toMatchInlineSnapshot(`
        [
          {
            "details": {
              "error": "Too many off-class cards. (11 / 10)",
            },
            "type": "INVALID_DECK_OPTION",
          },
        ]
      `);
    });

    it("handles case: tag-based", () => {
      const result = validate(store, limitCarolyn);
      expect(result.valid).toBeTruthy();
    });

    it("handles case: tag-based, invalid", () => {
      const result = validate(store, limitCarolynInvalid);
      expect(result.valid).toBeFalsy();
      expect(result.errors).toMatchInlineSnapshot(`
        [
          {
            "details": {
              "error": "You cannot have more than 15 level 0-1 Seeker and/or Mystic cards (16 / 15)",
            },
            "type": "INVALID_DECK_OPTION",
          },
        ]
      `);
    });

    it("handles case: tag-based, versatile overlap", () => {
      const result = validate(store, limitCarolynVersatile);
      expect(result.valid).toBeTruthy();
    });

    it("handles case: tag-based, versatile overlap, invalid", () => {
      const result = validate(store, limitCarolynVersatileInvalid);
      expect(result.valid).toBeFalsy();
      expect(result.errors).toMatchInlineSnapshot(`
        [
          {
            "details": {
              "error": "Too many off-class cards for Versatile. (2 / 1)",
            },
            "type": "INVALID_DECK_OPTION",
          },
        ]
      `);
    });

    it("handles case: trait-based", () => {
      const result = validate(store, limitTrait);
      expect(result.valid).toBeTruthy();
    });

    it("handles case: trait-based, invalid", () => {
      const result = validate(store, limitTraitInvalid);
      expect(result.valid).toBeFalsy();
      expect(result.errors).toMatchInlineSnapshot(`
        [
          {
            "details": {
              "error": "Too many off-class cards. (11 / 10)",
            },
            "type": "INVALID_DECK_OPTION",
          },
        ]
      `);
    });

    it("handles case: too many by name", () => {
      const result = validate(store, limitTooManyByName);
      expect(result.valid).toBeFalsy();
      expect(result.errors).toMatchInlineSnapshot(`
        [
          {
            "details": [
              {
                "code": "09095",
                "limit": 2,
                "quantity": 4,
                "real_name": "Uncage the Soul",
              },
            ],
            "type": "INVALID_CARD_COUNT",
          },
        ]
      `);
    });
  });

  describe("at least", () => {
    it("handles case: factions, valid", () => {
      const result = validate(store, atleastFactions);
      expect(result.valid).toBeTruthy();
    });

    it("handles case: factions, invalid", () => {
      const result = validate(store, atleastFactionsInvalid);
      expect(result.valid).toBeFalsy();
      expect(result.errors).toMatchInlineSnapshot(`
        [
          {
            "details": {
              "error": "You must have at least 7 cards from 3 different factions",
            },
            "type": "INVALID_DECK_OPTION",
          },
        ]
      `);
    });
  });

  describe("special cards", () => {
    describe("ancestral knowledge", () => {
      it("handles case: forced learning, valid", () => {
        const result = validate(store, atleastAncestralKnowledge);
        expect(result.valid).toBeTruthy();
      });

      it("handles case: forced learning, invalid", () => {
        const result = validate(store, atleastAncestralKnowledgeInvalid);
        expect(result.valid).toBeFalsy();
        expect(result.errors).toMatchInlineSnapshot(`
          [
            {
              "details": {
                "error": "Deck must have at least 10 skill cards.",
              },
              "type": "INVALID_DECK_OPTION",
            },
          ]
        `);
      });
    });

    describe("forced learning", () => {
      it("handles case: forced learning, valid", () => {
        const result = validate(store, forcedLearning);
        expect(result.valid).toBeTruthy();
      });
    });

    describe("underworld market", () => {
      it("handles case: underworld market, valid", () => {
        const result = validate(store, underworldMarket);
        expect(result.valid).toBeTruthy();
      });
    });

    describe("underworld support", () => {
      it("handles case: underworld support, valid", () => {
        const result = validate(store, underworldSupport);
        expect(result.valid).toBeTruthy();
      });

      it("handles case: underworld support, invalid deck size", () => {
        const result = validate(store, underworldSupportInvalidSize);
        expect(result.valid).toBeFalsy();
        expect(result.errors).toMatchInlineSnapshot(`
          [
            {
              "details": {
                "target": "slots",
              },
              "type": "TOO_MANY_CARDS",
            },
          ]
        `);
      });

      it("handles case: underworld support, invalid deck limit", () => {
        const result = validate(store, underworldSupperInvalidDeckLimit);
        expect(result.valid).toBeFalsy();
        expect(result.errors).toMatchInlineSnapshot(`
          [
            {
              "details": [
                {
                  "code": "06117",
                  "limit": 1,
                  "quantity": 2,
                  "real_name": "Read the Signs",
                },
              ],
              "type": "INVALID_CARD_COUNT",
            },
          ]
        `);
      });
    });

    describe("versatile", () => {
      it("handles case: versatile", () => {
        const result = validate(store, limitVersatile);
        expect(result.valid).toBeTruthy();
      });

      it("handles case: versatile, invalid", () => {
        const result = validate(store, limitVersatileInvalid);
        expect(result.valid).toBeFalsy();
        expect(result.errors).toMatchInlineSnapshot(`
          [
            {
              "details": {
                "error": "Too many off-class cards for Versatile. (3 / 2)",
              },
              "type": "INVALID_DECK_OPTION",
            },
          ]
        `);
      });
    });

    describe("on your own", () => {
      it("handles case: on your own, valid", () => {
        const result = validate(store, limitOnYourOwn);
        expect(result.valid).toBeTruthy();
      });

      it("handles case: on your own, invalid", () => {
        const result = validate(store, limitOnYourOwnInvalid);
        expect(result.valid).toBeFalsy();
        expect(result.errors).toMatchInlineSnapshot(`
          [
            {
              "details": [
                {
                  "code": "03198",
                  "real_name": "Madame Labranche",
                  "target": "slots",
                },
              ],
              "type": "FORBIDDEN",
            },
          ]
        `);
      });
    });

    describe("parallel wendy (back)", () => {
      it("handles case: parallel wendy, valid", () => {
        const result = validate(store, parallelWendy);
        expect(result.valid).toBeTruthy();
      });

      it("handles case: parallel wendy, invalid", () => {
        const result = validate(store, parallelWendyInvalid);
        expect(result.valid).toBeFalsy();
        expect(result.errors).toMatchInlineSnapshot(`
          [
            {
              "details": {
                "target": "slots",
              },
              "type": "TOO_MANY_CARDS",
            },
            {
              "details": [
                {
                  "code": "07028",
                  "real_name": "Faustian Bargain",
                  "target": "slots",
                },
                {
                  "code": "07032",
                  "real_name": "Promise of Power",
                  "target": "slots",
                },
                {
                  "code": "07112",
                  "real_name": "Stirring Up Trouble",
                  "target": "slots",
                },
                {
                  "code": "07113",
                  "real_name": "Blasphemous Covenant",
                  "target": "slots",
                },
                {
                  "code": "07226",
                  "real_name": "Armageddon",
                  "target": "slots",
                },
                {
                  "code": "07227",
                  "real_name": "Eye of Chaos",
                  "target": "slots",
                },
              ],
              "type": "FORBIDDEN",
            },
          ]
        `);
      });
    });
  });

  describe("extra deck", () => {
    it("handles case: valid extra deck", () => {
      const result = validate(store, extraSlotsValid);
      expect(result.valid).toBeTruthy();
    });

    it("handles case: extra deck has too many cards", () => {
      const result = validate(store, extraSlotsTooManyCards);
      expect(result.valid).toBeFalsy();
      expect(result.errors).toMatchInlineSnapshot(`
        [
          {
            "details": {
              "target": "extraSlots",
            },
            "type": "TOO_MANY_CARDS",
          },
        ]
      `);
    });

    it("handles case: extra deck has too many copies of a card", () => {
      const result = validate(store, extraSlotsTooManyCopies);
      expect(result.valid).toBeFalsy();
      expect(result.errors).toMatchInlineSnapshot(`
        [
          {
            "details": [
              {
                "code": "01018",
                "limit": 1,
                "quantity": 2,
                "real_name": "Beat Cop",
              },
            ],
            "type": "INVALID_CARD_COUNT",
          },
        ]
      `);
    });

    it("handles case: extra deck contains forbidden cards", () => {
      const result = validate(store, extraSlotsForbidden);
      expect(result.valid).toBeFalsy();
      expect(result.errors).toMatchInlineSnapshot(`
        [
          {
            "details": [
              {
                "code": "06285",
                "real_name": "The Black Cat",
                "target": "extraSlots",
              },
            ],
            "type": "FORBIDDEN",
          },
        ]
      `);
    });

    it("handles case: extra deck has too few cards", () => {
      const result = validate(store, extraSlotsTooFewCards);
      expect(result.valid).toBeFalsy();
      expect(result.errors).toMatchInlineSnapshot(`
        [
          {
            "details": {
              "target": "extraSlots",
            },
            "type": "TOO_FEW_CARDS",
          },
        ]
      `);
    });

    it("handles case: extra deck is missing signature", () => {
      const deck = structuredClone(extraSlotsValid);
      deck.meta = deck.meta.replace("90053", "60213");

      const result = validate(store, deck);

      expect(result.valid).toBeFalsy();
      expect(result.errors).toMatchInlineSnapshot(`
        [
          {
            "type": "DECK_REQUIREMENTS_NOT_MET",
          },
        ]
      `);
    });

    it("handles case: extra deck too many missing signature", () => {
      const deck = structuredClone(extraSlotsValid);
      deck.meta = deck.meta.replace("90053", "90053,90053");

      const result = validate(store, deck);

      expect(result.valid).toBeFalsy();
      expect(result.errors).toMatchInlineSnapshot(`
        [
          {
            "details": {
              "target": "extraSlots",
            },
            "type": "TOO_MANY_CARDS",
          },
          {
            "details": [
              {
                "code": "90053",
                "limit": 1,
                "quantity": 2,
                "real_name": "Vengeful Shade",
              },
            ],
            "type": "INVALID_CARD_COUNT",
          },
        ]
      `);
    });
  });

  describe("ignore deck limit", () => {
    it("handles case: parallel agnes, valid", () => {
      const result = validate(store, parallelAgnesValid);
      expect(result.valid).toBeTruthy();
    });

    it("handles case: parallel agnes, valid (over deck_limit)", () => {
      const deck = structuredClone(parallelAgnesValid);
      deck.slots["06201"] = 4;
      deck.slots["10102"] = 0;
      const result = validate(store, deck);
      expect(result.valid).toBeTruthy();
    });

    it("handles case: parallel agnes, invalid (over deck_limit)", () => {
      const deck = structuredClone(parallelAgnesValid);
      deck.slots["06201"] = 4;
      deck.slots["10102"] = 0;
      deck.ignoreDeckLimitSlots["06201"] = 1;
      const result = validate(store, deck);
      expect(result.valid).toBeFalsy();
      expect(result.errors).toMatchInlineSnapshot(`
        [
          {
            "details": {
              "target": "slots",
            },
            "type": "TOO_MANY_CARDS",
          },
          {
            "details": [
              {
                "code": "06201",
                "limit": 2,
                "quantity": 3,
                "real_name": "Spectral Razor",
              },
            ],
            "type": "INVALID_CARD_COUNT",
          },
        ]
      `);
    });
  });
});
