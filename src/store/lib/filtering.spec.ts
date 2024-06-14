/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeAll, describe, expect, it } from "vitest";
import type { StoreApi } from "zustand";

import { getMockStore } from "@/test/get-mock-store";

import type { StoreState } from "../slices";
import type { InvestigatorAccessConfig } from "./filtering";
import { filterInvestigatorAccess } from "./filtering";

function applyFilter(
  state: StoreState,
  code: string,
  target: string,
  config?: InvestigatorAccessConfig,
) {
  return filterInvestigatorAccess(
    state.metadata.cards[code],
    state.lookupTables,
    config,
  )(state.metadata.cards[target]);
}

describe("filter: investigator access", () => {
  let store: StoreApi<StoreState>;

  beforeAll(async () => {
    store = await getMockStore();
  });

  describe("general", () => {
    it("returns true for the investigator's signature cards", () => {
      const state = store.getState();
      expect(applyFilter(state, "01001", "01006")).toBeTruthy(); // signature.
      expect(applyFilter(state, "01001", "98005")).toBeTruthy(); // replacement.
      expect(applyFilter(state, "01001", "90030")).toBeTruthy(); // advanced.
      expect(applyFilter(state, "01001", "90025")).toBeTruthy(); // parallel.
      expect(applyFilter(state, "01001", "01506")).toBeTruthy(); // revised core.
    });

    it("returns false for other investigator's signature cards", () => {
      const state = store.getState();
      expect(applyFilter(state, "01001", "01014")).toBeFalsy();
    });

    it("returns true for neutral cards of any level", () => {
      const state = store.getState();
      expect(applyFilter(state, "01001", "01093")).toBeTruthy();
      expect(applyFilter(state, "01001", "03315")).toBeTruthy();
    });
  });

  describe("class <> level filters", () => {
    it("returns true if class and level match", () => {
      const state = store.getState();
      expect(applyFilter(state, "01004", "09082")).toBeTruthy();
      expect(applyFilter(state, "01004", "60430")).toBeTruthy();
      expect(applyFilter(state, "01004", "60505")).toBeTruthy();
      expect(applyFilter(state, "01004", "60522")).toBeTruthy();
    });

    it("returns false if level outside range", () => {
      const state = store.getState();
      expect(applyFilter(state, "01004", "08080")).toBeFalsy();
    });

    it("returns false if class is different", () => {
      const state = store.getState();
      expect(applyFilter(state, "01004", "03234")).toBeFalsy();
      expect(applyFilter(state, "01004", "08033")).toBeFalsy();
      expect(applyFilter(state, "01004", "01016")).toBeFalsy();
    });

    it("returns true if multiclass contains class", () => {
      const state = store.getState();
      expect(applyFilter(state, "01004", "08093")).toBeTruthy();
      expect(applyFilter(state, "01004", "08124")).toBeTruthy();
    });

    it("returns false if multiclass does not grant access", () => {
      const state = store.getState();
      expect(applyFilter(state, "01004", "08087")).toBeFalsy();
      expect(applyFilter(state, "01004", "08097")).toBeFalsy();
    });

    it("correctly handles case where access comprises multiple factions", () => {
      const state = store.getState();
      expect(applyFilter(state, "03006", "08067")).toBeTruthy();
      expect(applyFilter(state, "03006", "06237")).toBeTruthy();
      expect(applyFilter(state, "03006", "08080")).toBeTruthy();
      expect(applyFilter(state, "03006", "03309")).toBeTruthy();
      expect(applyFilter(state, "03006", "09117")).toBeTruthy();
      expect(applyFilter(state, "03006", "53004")).toBeFalsy();
      expect(applyFilter(state, "03006", "09096")).toBeFalsy();
      expect(applyFilter(state, "03006", "60529")).toBeFalsy();
      expect(applyFilter(state, "03006", "60331")).toBeFalsy();
      expect(applyFilter(state, "03006", "04229")).toBeFalsy();
    });
  });

  describe("uses filters", () => {
    it("returns true if card uses() the target resource", () => {
      const state = store.getState();
      expect(applyFilter(state, "03004", "03266")).toBeTruthy();
    });

    it("returns false if card uses a different resource", () => {
      const state = store.getState();
      expect(applyFilter(state, "03004", "60209")).toBeFalsy();
    });
  });

  describe("parley filter", () => {
    it("returns true if the card has the parley keyword printed", () => {
      const state = store.getState();
      expect(applyFilter(state, "10009", "10091")).toBeTruthy();
      expect(applyFilter(state, "10009", "09052")).toBeTruthy();
      expect(applyFilter(state, "10009", "09081")).toBeTruthy();
    });

    it("returns true for cards that have parley printed elsewhere", () => {
      const state = store.getState();
      expect(applyFilter(state, "10009", "09101")).toBeTruthy();
    });

    it("returns false for cards that have a different action keyword", () => {
      const state = store.getState();
      expect(applyFilter(state, "10009", "60114")).toBeFalsy();
    });
  });

  describe("trait filters", () => {
    it("returns true trait matches", () => {
      const state = store.getState();
      expect(applyFilter(state, "03004", "05316")).toBeTruthy();
    });

    it("returns false if trait matches, but level too high", () => {
      const state = store.getState();
      expect(applyFilter(state, "03004", "54004")).toBeFalsy();
    });

    it("correctly handles multi-trait access", () => {
      const state = store.getState();
      expect(applyFilter(state, "10015", "06157")).toBeTruthy();
      expect(applyFilter(state, "10015", "60325")).toBeTruthy();
      expect(applyFilter(state, "10015", "07153")).toBeTruthy();
    });

    it("returns true if a customizable option adds access via a trait", () => {
      const state = store.getState();
      expect(applyFilter(state, "04002", "09022")).toBeTruthy();
    });

    it("returns false if customizable access is ignored", () => {
      const state = store.getState();
      expect(
        applyFilter(state, "04002", "09022", {
          ignoreUnselectedCustomizableOptions: true,
        }),
      ).toBeFalsy();
    });
  });

  describe("type filters", () => {
    it("returns true if trait + type combination matches", () => {
      const state = store.getState();
      expect(applyFilter(state, "07002", "08024")).toBeTruthy();
    });
  });

  describe("faction selection filters", () => {
    it("returns false if faction is not among choosable options", () => {
      const state = store.getState();
      expect(applyFilter(state, "09001", "04268")).toBeFalsy();
    });

    it("returns true if no faction is specified and faction is among options", () => {
      const state = store.getState();
      expect(applyFilter(state, "09001", "03156")).toBeTruthy();
      expect(applyFilter(state, "09001", "60420")).toBeTruthy();
      expect(applyFilter(state, "09001", "09052")).toBeTruthy();
      expect(applyFilter(state, "09001", "08050")).toBeFalsy();
    });

    it("returns true if faction is specified and matches chosen option", () => {
      const state = store.getState();

      const config = {
        selections: {
          faction_selected: { value: "seeker" },
        },
      } as any;

      expect(applyFilter(state, "06003", "01036", config)).toBeTruthy();
    });

    it("returns false if faction is specified and card maps to option not chosen", () => {
      const state = store.getState();

      const config = {
        selections: {
          faction_selected: { value: "seeker" },
        },
      } as any;

      expect(applyFilter(state, "06003", "03156", config)).toBeFalsy();
      expect(applyFilter(state, "06003", "52002", config)).toBeFalsy();
    });

    it("returns true if faction is specified and is among chosen options", () => {
      const state = store.getState();

      const config = {
        selections: {
          faction_1: { value: "survivor" },
          faction_2: { value: "mystic" },
        },
      } as any;

      expect(applyFilter(state, "09018", "03156", config)).toBeTruthy();
      expect(applyFilter(state, "09018", "60420", config)).toBeTruthy();
    });

    it("returns false if faction is specified and card maps to option not among chosen options", () => {
      const state = store.getState();

      const config = {
        selections: {
          faction_1: { value: "survivor" },
          faction_2: { value: "mystic" },
        },
      } as any;

      expect(applyFilter(state, "09018", "09052", config)).toBeFalsy();
      expect(applyFilter(state, "09018", "09022", config)).toBeFalsy();
      expect(applyFilter(state, "09018", "07025", config)).toBeFalsy();
    });
  });

  describe("negation", () => {
    it("returns false if a card is negated by a trait limit", () => {
      const state = store.getState();
      expect(applyFilter(state, "05003", "07025")).toBeFalsy();
    });

    it("returns false if a card is negated by a permanent clause", () => {
      const state = store.getState();
      expect(applyFilter(state, "89001", "08031")).toBeFalsy();
    });

    it("handles 'not unless' clauses", () => {
      const state = store.getState();
      expect(applyFilter(state, "90078", "10075")).toBeTruthy();
      expect(applyFilter(state, "90078", "07273")).toBeTruthy();
      expect(applyFilter(state, "90078", "07272")).toBeFalsy();
      expect(applyFilter(state, "90078", "10130")).toBeFalsy();
    });
  });

  describe("tag-based access", () => {
    it("returns true if tag matches card access rules", () => {
      const state = store.getState();
      expect(applyFilter(state, "05001", "08044")).toBeTruthy();
      expect(applyFilter(state, "09004", "08068")).toBeTruthy();
    });

    it("returns true if customizable option adds access", () => {
      const state = store.getState();
      state.metadata.cards["09040"].faction_code = "rogue";
      state.metadata.cards["09040"].xp = 4;
      expect(applyFilter(state, "05001", "09040")).toBeTruthy();
      expect(applyFilter(state, "09004", "09040")).toBeTruthy();
    });

    it("returns false if customizable option adds access, but is ignored", () => {
      const state = store.getState();
      state.metadata.cards["09040"].faction_code = "rogue";
      state.metadata.cards["09040"].xp = 4;
      expect(
        applyFilter(state, "05001", "09040", {
          ignoreUnselectedCustomizableOptions: true,
        }),
      ).toBeFalsy();
      expect(
        applyFilter(state, "09004", "09040", {
          ignoreUnselectedCustomizableOptions: true,
        }),
      ).toBeFalsy();
    });
  });

  describe("option_select filters", () => {
    it("returns true if card matches any option and no selection is provided", () => {
      const state = store.getState();
      expect(applyFilter(state, "90037", "07192")).toBeTruthy();
      expect(applyFilter(state, "90037", "10104")).toBeTruthy();
      expect(applyFilter(state, "90037", "05194")).toBeTruthy();
    });

    it("handles option selection with multiple traits", () => {
      const state = store.getState();

      const config = {
        selections: {
          option_selected: { value: { id: "both" } },
        },
      } as any;

      expect(applyFilter(state, "90037", "07192", config)).toBeTruthy();
      expect(applyFilter(state, "90037", "10104", config)).toBeTruthy();
      expect(applyFilter(state, "90037", "05194", config)).toBeTruthy();
    });

    it("handles option selection with single traits", () => {
      const state = store.getState();

      const config = {
        selections: {
          option_selected: { value: { id: "blessed" } },
        },
      } as any;

      expect(applyFilter(state, "90037", "07192", config)).toBeTruthy();
      expect(applyFilter(state, "90037", "10104", config)).toBeTruthy();
      expect(applyFilter(state, "90037", "05194", config)).toBeFalsy();
    });

    it("handles other option selection with single traits", () => {
      const state = store.getState();

      const config = {
        selections: {
          option_selected: { value: { id: "cursed" } },
        },
      } as any;

      expect(applyFilter(state, "90037", "07192", config)).toBeFalsy();
      expect(applyFilter(state, "90037", "10104", config)).toBeTruthy();
      expect(applyFilter(state, "90037", "05194", config)).toBeTruthy();
    });
  });

  describe("parallel jim: extra deck", () => {
    it("handles slots mode when investigator has an extra deck", () => {
      const state = store.getState();

      const config = {
        targetDeck: "slots",
      } as any;

      // FIXME: the card should not show up here.
      // expect(applyFilter(state, "90049", "90053", config)).toBeFalsy();
      expect(applyFilter(state, "90049", "01018", config)).toBeFalsy();
      expect(applyFilter(state, "90049", "03266", config)).toBeTruthy();
      expect(applyFilter(state, "90049", "01063", config)).toBeTruthy();
    });

    it("handles extraSlots mode when investigator has an extra deck", () => {
      const state = store.getState();

      const config = {
        targetDeck: "extraSlots",
      } as any;

      expect(applyFilter(state, "90049", "90053", config)).toBeTruthy();
      expect(applyFilter(state, "90049", "01018", config)).toBeTruthy();
      expect(applyFilter(state, "90049", "01063", config)).toBeTruthy();
      expect(applyFilter(state, "90049", "03266", config)).toBeFalsy();
    });

    it("handles both mode when investigator has an extra deck", () => {
      const state = store.getState();

      const config = {
        targetDeck: "both",
      } as any;

      expect(applyFilter(state, "90049", "90053", config)).toBeTruthy();
      expect(applyFilter(state, "90049", "01018", config)).toBeTruthy();
      expect(applyFilter(state, "90049", "01063", config)).toBeTruthy();
      expect(applyFilter(state, "90049", "03266", config)).toBeTruthy();
    });
  });
});
