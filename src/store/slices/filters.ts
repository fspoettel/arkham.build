import type { StateCreator } from "zustand";

import type { StoreState } from ".";
import type {
  CardTypeFilter,
  FilterObject,
  Filters,
  FiltersSlice,
} from "./filters.types";

function getInitialState(): Filters {
  const shared = {
    ownership: {
      open: false,
      value: "owned" as const,
    },
    packCode: {
      open: false,
      value: [],
    },
    faction: {
      open: true,
      value: [],
    },
    cost: {
      open: false,
      value: {
        range: undefined,
        even: false,
        odd: false,
        x: true,
      },
    },
    skillIcons: {
      open: false,
      value: {
        agility: null,
        combat: null,
        intellect: null,
        willpower: null,
        wild: null,
        any: null,
      },
    },
    type: {
      open: false,
      value: [],
    },
    subtype: {
      open: false,
      value: [],
    },
    trait: {
      open: false,
      value: [],
    },
    action: {
      open: false,
      value: [],
    },
    asset: {
      value: {
        health: undefined,
        sanity: undefined,
        healthX: true,
        skillBoosts: [],
        slots: [],
        uses: [],
      },
      open: false,
    },
    properties: {
      open: false,
      value: {
        bonded: false,
        customizable: false,
        seal: false,
        unique: false,
        fast: false,
        permanent: false,
        exile: false,
        victory: false,
        healsHorror: false,
        healsDamage: false,
        succeedBy: false,
      },
    },
  };

  return {
    touched: false,
    cardType: "player",
    player: {
      ...structuredClone(shared),
      level: {
        open: false,
        value: {
          range: undefined,
          exceptional: false,
          nonexceptional: false,
        },
      },
      investigator: {
        value: undefined,
        open: false,
      },
      tabooSet: {
        value: undefined,
        open: false,
      },
    },
    encounter: {
      ...structuredClone(shared),
      encounterSet: {
        value: [],
        open: false,
      },
    },
  };
}

function getInitialOwnershipFilter(state: StoreState) {
  if (state.settings.showAllCards) {
    return {
      open: false,
      value: "all" as const,
    };
  }

  const value = Object.values(state.settings.collection).some((x) => x)
    ? ("owned" as const)
    : ("all" as const);

  return {
    open: false,
    value,
  };
}

export function getInitialFilters(state: StoreState): StoreState["filters"] {
  const initialOwnershipSetting = getInitialOwnershipFilter(state);

  return {
    ...state.filters,
    player: {
      ...state.filters.player,
      ownership: initialOwnershipSetting,
    },
    encounter: {
      ...state.filters.encounter,
      ownership: initialOwnershipSetting,
    },
  };
}

export const createFiltersSlice: StateCreator<
  StoreState,
  [],
  [],
  FiltersSlice
> = (set, get) => ({
  filters: getInitialState(),

  resetFilters() {
    const state = get();
    const initial = getInitialState();
    const initialOwnershipSetting = getInitialOwnershipFilter(state);

    set({
      filters: {
        touched: false,
        cardType: state.filters.cardType,
        player: {
          ...initial.player,
          ownership: initialOwnershipSetting,
        },
        encounter: {
          ...initial.encounter,
          ownership: initialOwnershipSetting,
        },
      },
    });
  },

  resetFilterKey(type, path) {
    const state = get();
    const initialState = getInitialState();

    set({
      filters: {
        ...state.filters,
        [type]: {
          ...state.filters[type],
          [path]: initialState[type][path],
        },
      },
    });
  },

  setActiveCardType(cardType) {
    const state = get();
    set({
      filters: {
        ...state.filters,
        cardType,
      },
      ui: {
        ...state.ui,
      },
    });
  },

  setFilter(slice, path, key, value) {
    set({
      filters: updateValue(get(), slice, path, key, value),
    });
  },

  setNestedFilter(type, path, key, value) {
    const state = get();

    const current = state.filters[type][path] as FilterObject<
      Record<string, unknown>
    >;

    const filters = updateValue(get(), type, path, "value", {
      ...current.value,
      [key]: value,
    });

    set({ filters });
  },

  setFilterOpen(type, path, val) {
    const filters = updateValue(get(), type, path, "open", val);
    set({ filters });
  },

  applyLevelShortcut(value) {
    if (value === "0") {
      const filters = updateValue(get(), "player", "level", "value", {
        range: [0, 0],
      });
      set({ filters });
    } else if (value === "1-5") {
      const filters = updateValue(get(), "player", "level", "value", {
        range: [1, 5],
      });
      set({ filters });
    } else {
      const filters = updateValue(get(), "player", "level", "value", {
        range: undefined,
      });
      set({ filters });
    }
  },
});

function updateValue<
  T,
  C extends CardTypeFilter,
  P extends keyof Filters[C],
  K extends keyof FilterObject<T>,
>(state: StoreState, slice: C, path: P, key: K, value: T) {
  return {
    ...state.filters,
    touched: key === "open" ? state.filters.touched : true,
    [slice]: {
      ...state.filters[slice],
      [path]: {
        ...state.filters[slice][path],
        [key]: value,
      },
    },
  };
}