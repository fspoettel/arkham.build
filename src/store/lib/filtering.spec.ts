/* eslint-disable @typescript-eslint/no-explicit-any */
import { beforeAll, describe, expect, it } from "vitest";
import type { StoreApi } from "zustand";

import { getMockStore } from "@/test/get-mock-store";

import type { StoreState } from "../slices";
import type {
  AssetFilter,
  CostFilter,
  LevelFilter,
  SkillIconsFilter,
} from "../slices/filters.types";
import type { InvestigatorAccessConfig } from "./filtering";
import {
  filterActions,
  filterAssets,
  filterCost,
  filterFactions,
  filterInvestigatorAccess,
  filterLevel,
  filterOwnership,
  filterSkillIcons,
} from "./filtering";

describe("filter: investigator access", () => {
  let store: StoreApi<StoreState>;

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
    )?.(state.metadata.cards[target]);
  }

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

  describe("parallel wendy: option_select", () => {
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

  describe("additional deck options", () => {
    it("handles an extra deck option", () => {
      const state = store.getState();
      expect(applyFilter(state, "01001", "01047")).toBeFalsy();
      expect(
        applyFilter(state, "01001", "01021", {
          additionalDeckOptions: [
            {
              level: { min: 0, max: 0 },
              limit: 1,
              error: "Too many off-class cards for Versatile.",
            },
          ],
        }),
      ).toBeTruthy();
    });

    it("handles a 'not' additional deck option", () => {
      const state = store.getState();
      expect(applyFilter(state, "01001", "01021")).toBeTruthy();
      expect(
        applyFilter(state, "01001", "01021", {
          additionalDeckOptions: [
            {
              not: true,
              slot: ["Ally"],
              level: { min: 0, max: 5 },
              error: "You cannot have assets that take up an ally slot.",
              virtual: true,
            },
          ],
        }),
      ).toBeFalsy();
    });
  });
});

describe("filter: level", () => {
  let store: StoreApi<StoreState>;

  beforeAll(async () => {
    store = await getMockStore();
  });

  function applyFilter(
    state: StoreState,
    code: string,
    config: LevelFilter["value"],
  ) {
    return filterLevel(config)(state.metadata.cards[code]);
  }

  it("handles case: no range", () => {
    const state = store.getState();

    const config = {
      range: undefined,
      nonexceptional: false,
      exceptional: false,
    };

    expect(applyFilter(state, "60505", config)).toBeTruthy();
    expect(applyFilter(state, "60522", config)).toBeTruthy();
    expect(applyFilter(state, "02005", config)).toBeTruthy(); // investigator
    expect(applyFilter(state, "02014", config)).toBeTruthy(); // signature
    expect(applyFilter(state, "02015", config)).toBeTruthy(); // weakness
  });

  it("handles case: lvl. 0", () => {
    const state = store.getState();

    const config = {
      range: [0, 0] as [number, number],
      nonexceptional: false,
      exceptional: false,
    };

    expect(applyFilter(state, "60505", config)).toBeTruthy();
    expect(applyFilter(state, "60522", config)).toBeFalsy();
    expect(applyFilter(state, "02005", config)).toBeFalsy(); // investigator
    expect(applyFilter(state, "02014", config)).toBeFalsy(); // signature
    expect(applyFilter(state, "02015", config)).toBeFalsy(); // weakness
  });

  it("handles case: lvl. 0-5", () => {
    const state = store.getState();

    const config = {
      range: [0, 5] as [number, number],
      nonexceptional: false,
      exceptional: false,
    };

    expect(applyFilter(state, "60505", config)).toBeTruthy();
    expect(applyFilter(state, "60522", config)).toBeTruthy();
    expect(applyFilter(state, "02005", config)).toBeFalsy(); // investigator
    expect(applyFilter(state, "02014", config)).toBeFalsy(); // signature
    expect(applyFilter(state, "02015", config)).toBeFalsy(); // weakness
  });

  it("handles case: lvl. 1-5", () => {
    const state = store.getState();

    const config = {
      range: [1, 5] as [number, number],
      nonexceptional: false,
      exceptional: false,
    };

    expect(applyFilter(state, "60505", config)).toBeFalsy();
    expect(applyFilter(state, "60522", config)).toBeTruthy();
    expect(applyFilter(state, "02005", config)).toBeFalsy(); // investigator
    expect(applyFilter(state, "02014", config)).toBeFalsy(); // signature
    expect(applyFilter(state, "02015", config)).toBeFalsy(); // weakness
  });

  it("handles case: exceptional", () => {
    const state = store.getState();

    const config = {
      range: undefined,
      nonexceptional: false,
      exceptional: true,
    };

    expect(applyFilter(state, "60505", config)).toBeFalsy();
    expect(applyFilter(state, "07268", config)).toBeTruthy();
  });

  it("handles case: non-exceptional", () => {
    const state = store.getState();

    const config = {
      range: undefined,
      nonexceptional: true,
      exceptional: false,
    };

    expect(applyFilter(state, "60505", config)).toBeTruthy();
    expect(applyFilter(state, "07268", config)).toBeFalsy();
  });
});

describe("filter: cost", () => {
  let store: StoreApi<StoreState>;

  beforeAll(async () => {
    store = await getMockStore();
  });

  function applyFilter(
    state: StoreState,
    code: string,
    config: CostFilter["value"],
  ) {
    return filterCost(config)(state.metadata.cards[code]);
  }

  it("handles case: no range", () => {
    const state = store.getState();

    const config = {
      range: undefined,
      x: false,
      even: false,
      odd: false,
    };

    expect(applyFilter(state, "07025", config)).toBeTruthy(); // asset (4)
    expect(applyFilter(state, "01040", config)).toBeTruthy(); // asset (0)
    expect(applyFilter(state, "01090", config)).toBeTruthy(); // skill
    expect(applyFilter(state, "02151", config)).toBeTruthy(); // event
    expect(applyFilter(state, "02005", config)).toBeTruthy(); // investigator
    expect(applyFilter(state, "07038", config)).toBeTruthy(); // enemy
  });

  it("handles case: 0+", () => {
    const state = store.getState();

    const config = {
      range: [0, 10] as [number, number],
      x: false,
      even: false,
      odd: false,
    };

    expect(applyFilter(state, "07025", config)).toBeTruthy(); // asset (4)
    expect(applyFilter(state, "01040", config)).toBeTruthy(); // asset (0)
    expect(applyFilter(state, "01090", config)).toBeFalsy(); // skill
    expect(applyFilter(state, "02151", config)).toBeTruthy(); // event
    expect(applyFilter(state, "02005", config)).toBeFalsy(); // investigator
    expect(applyFilter(state, "07038", config)).toBeFalsy(); // enemy
  });

  it("handles case: custom range", () => {
    const state = store.getState();

    const config = {
      range: [4, 10] as [number, number],
      x: false,
      even: false,
      odd: false,
    };

    expect(applyFilter(state, "07025", config)).toBeTruthy(); // asset (4)
    expect(applyFilter(state, "09082", config)).toBeFalsy(); // asset (3)
    expect(applyFilter(state, "01040", config)).toBeFalsy(); // asset (0)
  });

  it("handles case: even", () => {
    const state = store.getState();

    const config = {
      range: undefined,
      x: false,
      even: true,
      odd: false,
    };

    expect(applyFilter(state, "07025", config)).toBeTruthy(); // asset (4)
    expect(applyFilter(state, "09082", config)).toBeFalsy(); // asset (3)
    expect(applyFilter(state, "01040", config)).toBeTruthy(); // asset (0)
  });

  it("handles case: odd", () => {
    const state = store.getState();

    const config = {
      range: undefined,
      x: false,
      even: false,
      odd: true,
    };

    expect(applyFilter(state, "07025", config)).toBeFalsy(); // asset (4)
    expect(applyFilter(state, "09082", config)).toBeTruthy(); // asset (3)
    expect(applyFilter(state, "01040", config)).toBeFalsy(); // asset (0)
  });

  it("handles case: X", () => {
    const state = store.getState();

    const config = {
      range: [0, 10] as [number, number],
      x: true,
      even: false,
      odd: false,
    };

    expect(applyFilter(state, "07268", config)).toBeTruthy(); // X
    expect(applyFilter(state, "07268", { ...config, x: false })).toBeFalsy(); // X
  });
});

describe("filter: assets", () => {
  let store: StoreApi<StoreState>;

  beforeAll(async () => {
    store = await getMockStore();
  });

  function applyFilter(state: StoreState, code: string, config: AssetFilter) {
    return filterAssets(config, state.lookupTables)(state.metadata.cards[code]);
  }

  const defaultConfig: AssetFilter = {
    open: false,
    value: {
      health: undefined,
      sanity: undefined,
      skillBoosts: [],
      slots: [],
      uses: [],
      healthX: false,
    },
  };

  it("handles case: no restrictions", () => {
    const state = store.getState();
    const config = structuredClone(defaultConfig);
    expect(applyFilter(state, "09103", config)).toBeTruthy(); // asset
    expect(applyFilter(state, "01090", config)).toBeTruthy(); // skill
    expect(applyFilter(state, "02151", config)).toBeTruthy(); // event
    expect(applyFilter(state, "02005", config)).toBeTruthy(); // investigator
    expect(applyFilter(state, "07038", config)).toBeTruthy(); // enemy
  });

  it("handles case: complex filter", () => {
    const state = store.getState();
    const config = structuredClone(defaultConfig);
    config.value.slots = ["Hand"];
    config.value.uses = ["supplies"];
    config.value.skillBoosts = ["intellect"];
    expect(applyFilter(state, "05024", config)).toBeTruthy();
    expect(applyFilter(state, "09083", config)).toBeFalsy();
    expect(applyFilter(state, "01087", config)).toBeFalsy();
    expect(applyFilter(state, "01090", config)).toBeFalsy(); // skill
    expect(applyFilter(state, "02151", config)).toBeFalsy(); // event
    expect(applyFilter(state, "02005", config)).toBeFalsy(); // investigator
    expect(applyFilter(state, "07038", config)).toBeFalsy(); // enemy
  });

  it("handles case: health", () => {
    const state = store.getState();
    const config = structuredClone(defaultConfig);
    config.value.health = [3, 3] as [number, number];
    expect(applyFilter(state, "09103", config)).toBeTruthy();
    expect(applyFilter(state, "09037", config)).toBeFalsy();
  });

  it("handles case: sanity", () => {
    const state = store.getState();
    const config = structuredClone(defaultConfig);
    config.value.sanity = [3, 3] as [number, number];
    expect(applyFilter(state, "09024", config)).toBeTruthy();
    expect(applyFilter(state, "09037", config)).toBeFalsy();
  });

  it("handles case: health X", () => {
    const state = store.getState();
    const config = structuredClone(defaultConfig);
    config.value.sanity = [10, 10] as [number, number];
    config.value.healthX = true;
    expect(applyFilter(state, "07189", config)).toBeTruthy();
    config.value.healthX = false;
    expect(applyFilter(state, "07189", config)).toBeFalsy();
  });
});

describe("filter: factions", () => {
  let store: StoreApi<StoreState>;

  beforeAll(async () => {
    store = await getMockStore();
  });

  function applyFilter(state: StoreState, code: string, config: string[]) {
    return filterFactions(config)(state.metadata.cards[code]);
  }
  it("handles case :multiclass", () => {
    const state = store.getState();
    expect(applyFilter(state, "05116", ["multiclass"])).toBeTruthy();
    expect(applyFilter(state, "05116", ["multiclass", "survivor"])).toBeFalsy();
    expect(applyFilter(state, "05189", ["multiclass"])).toBeFalsy();
    expect(applyFilter(state, "05188", ["multiclass"])).toBeFalsy();
  });
});

describe("filter: actions", () => {
  let store: StoreApi<StoreState>;

  beforeAll(async () => {
    store = await getMockStore();
  });

  function applyFilter(state: StoreState, code: string, config: string[]) {
    return filterActions(
      config,
      state.lookupTables.actions,
    )(state.metadata.cards[code]);
  }

  it("handles case: no restrictions", () => {
    const state = store.getState();
    const config: string[] = [];
    expect(applyFilter(state, "01040", config)).toBeTruthy(); // asset
    expect(applyFilter(state, "01090", config)).toBeTruthy(); // skill
    expect(applyFilter(state, "02151", config)).toBeTruthy(); // event
    expect(applyFilter(state, "02005", config)).toBeTruthy(); // investigator
    expect(applyFilter(state, "07038", config)).toBeTruthy(); // enemy
  });

  it("handles case: has action", () => {
    const state = store.getState();
    const config: string[] = ["evade"];
    expect(applyFilter(state, "09085", config)).toBeTruthy(); // evade
    expect(applyFilter(state, "07029", config)).toBeTruthy(); // double evade
    expect(applyFilter(state, "05114", config)).toBeFalsy(); // fight
    expect(applyFilter(state, "01090", config)).toBeFalsy(); // skill
    expect(applyFilter(state, "02151", config)).toBeFalsy(); // event
    expect(applyFilter(state, "02005", config)).toBeFalsy(); // investigator
    expect(applyFilter(state, "07038", config)).toBeFalsy(); // enemy
  });
});

describe("filter: skills", () => {
  let store: StoreApi<StoreState>;

  beforeAll(async () => {
    store = await getMockStore();
  });

  function applyFilter(
    state: StoreState,
    code: string,
    config: SkillIconsFilter["value"],
  ) {
    return filterSkillIcons(config)(state.metadata.cards[code]);
  }

  const defaultConfig: SkillIconsFilter["value"] = {
    willpower: null,
    intellect: null,
    combat: null,
    agility: null,
    wild: null,
    any: null,
  };

  it("handles case: single skill", () => {
    const config = structuredClone(defaultConfig);
    config.intellect = 2;
    expect(applyFilter(store.getState(), "02303", config)).toBeTruthy();
    config.intellect = null;
    config.willpower = 2;
    expect(applyFilter(store.getState(), "02303", config)).toBeFalsy();
  });

  it("handles case: multiple skills", () => {
    const config = structuredClone(defaultConfig);
    config.agility = 2;
    config.combat = 2;
    expect(applyFilter(store.getState(), "08089", config)).toBeFalsy();
  });

  it("handles case: wild", () => {
    const config = structuredClone(defaultConfig);
    config.wild = 2;
    expect(applyFilter(store.getState(), "02303", config)).toBeFalsy();
    expect(applyFilter(store.getState(), "03018", config)).toBeTruthy();
  });

  it("handles case: any", () => {
    const config = structuredClone(defaultConfig);
    config.any = 2;
    expect(applyFilter(store.getState(), "02303", config)).toBeTruthy();
    expect(applyFilter(store.getState(), "03018", config)).toBeTruthy();
    expect(applyFilter(store.getState(), "60505", config)).toBeFalsy();
  });

  it("handles case: any + other", () => {
    const config = structuredClone(defaultConfig);
    config.any = 2;
    config.willpower = 2;
    expect(applyFilter(store.getState(), "50001", config)).toBeTruthy();
    expect(applyFilter(store.getState(), "08070", config)).toBeFalsy();
    expect(applyFilter(store.getState(), "01089", config)).toBeFalsy();
  });
});

describe("filter: ownership", () => {
  let store: StoreApi<StoreState>;

  beforeAll(async () => {
    store = await getMockStore();
  });

  function applyFilter(
    state: StoreState,
    code: string,
    config: Record<string, number | boolean>,
  ) {
    return filterOwnership(
      state.metadata.cards[code],
      state.metadata,
      state.lookupTables,
      config,
    );
  }

  it("handles case: pack owned", () => {
    const state = store.getState();
    expect(applyFilter(state, "51007", {})).toBeFalsy();
    expect(applyFilter(state, "51007", { rtdwl: true })).toBeTruthy();
  });

  it("handles case: new / old formats", () => {
    const state = store.getState();
    expect(applyFilter(state, "02301", {})).toBeFalsy();
    expect(applyFilter(state, "02301", { litas: true })).toBeTruthy();
    expect(applyFilter(state, "02301", { dwlp: true })).toBeTruthy();
  });

  it("handles case: core set", () => {
    const state = store.getState();
    expect(applyFilter(state, "01039", {})).toBeFalsy();
    expect(applyFilter(state, "01039", { core: true })).toBeTruthy();
    expect(applyFilter(state, "01039", { rcore: true })).toBeTruthy();
  });

  // TODO: while we and arkhamcards both normalize cards to core set ids,
  //       arkhamdb doesn't, so we might want to make this case work.
  // it("handles case: revised core", () => {
  //   const state = store.getState();
  //   expect(applyFilter(state, "01539", { core: true })).toBeTruthy();
  //   expect(applyFilter(state, "01539", { rcore: true })).toBeTruthy();
  // });

  it("handles case: extended revised core", () => {
    const state = store.getState();
    expect(applyFilter(state, "51007", { core: true })).toBeFalsy();
    expect(applyFilter(state, "51007", { rcore: true })).toBeTruthy();
  });

  it("handles case: reprints", () => {
    const state = store.getState();
    expect(applyFilter(state, "01039", {})).toBeFalsy();
    expect(applyFilter(state, "01039", { har: true })).toBeTruthy();
  });
});
