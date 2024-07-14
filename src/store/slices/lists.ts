import type { StateCreator } from "zustand";

import { assert, isDefined } from "@/utils/assert";
import type { Filter } from "@/utils/fp";
import { and, not } from "@/utils/fp";

import type { StoreState } from ".";
import {
  filterBacksides,
  filterDuplicates,
  filterEncounterCards,
  filterMythosCards,
  filterType,
} from "../lib/filtering";
import {
  isAssetFilter,
  isCostFilter,
  isLevelFilter,
  isMultiSelectFilter,
  isOwnershipFilter,
  isPropertiesFilter,
  isSkillIconsFilter,
  isSubtypeFilter,
} from "./lists.type-guards";
import type {
  FilterKey,
  FilterMapping,
  List,
  OwnershipFilter,
  Search,
  SubtypeFilter,
} from "./lists.types";
import type {
  AssetFilter,
  CostFilter,
  LevelFilter,
  ListsSlice,
  PropertiesFilter,
  SkillIconsFilter,
} from "./lists.types";

function getInitialList() {
  if (window.location.href.includes("/deck/create")) {
    return "create_deck";
  }

  if (window.location.href.includes("/deck/")) {
    return "editor_player";
  }

  return "browse_player";
}

export const createListsSlice: StateCreator<StoreState, [], [], ListsSlice> = (
  set,
  get,
) => ({
  activeList: getInitialList(),
  lists: {},

  changeList(value, path) {
    const state = get();
    const prefix = path.includes("edit") ? "editor" : "browse";

    const listKey = `${prefix}_${value}`;

    if (state.lists[listKey]) {
      set({
        activeList: listKey,
      });
    }
  },

  resetFilters() {
    const state = get();
    if (!state.activeList) return;

    const list = state.lists[state.activeList];
    if (!list) return;

    set({
      lists: {
        ...state.lists,
        [state.activeList]: makeList(
          list.key,
          list.cardType,
          list.filters,
          list.grouping,
          list.sorting,
          list.systemFilter,
          {
            ownership: getInitialOwnershipFilter(state),
            subtype: getInitialSubtypeFilter(state),
          },
          list.search,
        ),
      },
    });
  },

  resetFilter(id) {
    const state = get();
    assert(isDefined(state.activeList), "no active list is defined.");

    const list = state.lists[state.activeList];
    assert(isDefined(list), `list ${state.activeList} not defined.`);

    assert(
      isDefined(list.filterValues[id]),
      `${state.activeList} has not filter ${id}.`,
    );

    const filterValues = { ...list.filterValues };
    filterValues[id] = makeFilterValue(filterValues[id].type, list.cardType);

    set({
      lists: {
        ...state.lists,
        [state.activeList]: {
          ...list,
          filterValues,
        },
      },
    });
  },

  setActiveList(value) {
    const state = get();

    if (value == null) {
      set({
        activeList: undefined,
      });
    } else if (state.lists[value] && state.activeList !== value) {
      set({
        activeList: value,
      });
    }
  },

  setFilterOpen(id, open) {
    const state = get();
    assert(isDefined(state.activeList), "no active list is defined.");

    const list = state.lists[state.activeList];
    assert(isDefined(list), `list ${state.activeList} not defined.`);

    const filterValues = { ...list.filterValues };
    assert(
      isDefined(filterValues[id]),
      `${state.activeList} has not filter ${id}.`,
    );

    filterValues[id] = { ...filterValues[id], open };

    set({
      lists: {
        ...state.lists,
        [state.activeList]: {
          ...list,
          filterValues,
        },
      },
    });
  },

  setFilterValue(id, payload) {
    const state = get();

    assert(isDefined(state.activeList), "no active list is defined.");

    const list = state.lists[state.activeList];
    assert(isDefined(list), `list ${state.activeList} not defined.`);

    assert(
      isDefined(list.filterValues[id]),
      `${state.activeList} has not filter ${id}.`,
    );

    const filterValues = { ...list.filterValues };

    switch (filterValues[id].type) {
      case "action":
      case "encounterSet":
      case "trait":
      case "type":
      case "pack":
      case "faction": {
        assert(
          isMultiSelectFilter(payload),
          `filter ${id} value must be an array.`,
        );
        filterValues[id] = { ...filterValues[id], value: payload };
        break;
      }

      case "cost": {
        const currentValue = filterValues[id].value as CostFilter;
        const value = { ...currentValue, ...payload };

        assert(
          isCostFilter(value),
          `filter ${id} value must be a cost object.`,
        );

        filterValues[id] = { ...filterValues[id], value };
        break;
      }

      case "level": {
        const currentValue = filterValues[id].value as LevelFilter;
        const value = { ...currentValue, ...payload };

        assert(
          isLevelFilter(value),
          `filter ${id} value must be an level object.`,
        );

        filterValues[id] = { ...filterValues[id], value };
        break;
      }

      case "ownership": {
        assert(
          isOwnershipFilter(payload),
          `filter ${id} value must be a string.`,
        );
        filterValues[id] = { ...filterValues[id], value: payload };
        break;
      }

      case "investigator": {
        assert(
          typeof payload === "string",
          `filter ${id} value must be a string.`,
        );
        filterValues[id] = { ...filterValues[id], value: payload };
        break;
      }

      case "tabooSet": {
        filterValues[id] = {
          ...filterValues[id],
          value: payload as number | undefined,
        };
        break;
      }

      case "subtype": {
        const currentValue = filterValues[id].value as SubtypeFilter;
        const value = { ...currentValue, ...payload };

        assert(
          isSubtypeFilter(value),
          `filter ${id} value must be a map of booleans.`,
        );

        filterValues[id] = { ...filterValues[id], value };
        break;
      }

      case "properties": {
        const currentValue = filterValues[id].value as PropertiesFilter;
        const value = { ...currentValue, ...payload };

        assert(
          isPropertiesFilter(value),
          `filter ${id} value must be a map of booleans.`,
        );

        filterValues[id] = { ...filterValues[id], value };
        break;
      }

      case "asset": {
        const currentValue = filterValues[id].value as AssetFilter;
        const value = { ...currentValue, ...payload };
        assert(
          isAssetFilter(value),
          `filter ${id} value must be an asset object.`,
        );

        filterValues[id] = { ...filterValues[id], value };
        break;
      }

      case "skillIcons": {
        assert(
          isSkillIconsFilter(payload),
          `filter ${id} value must be an object.`,
        );
        const currentValue = filterValues[id].value as SkillIconsFilter;
        const value = { ...currentValue, ...payload };

        filterValues[id] = { ...filterValues[id], value };
        break;
      }
    }

    set({
      lists: {
        ...state.lists,
        [state.activeList]: {
          ...list,
          filterValues,
        },
      },
    });
  },

  setSearchFlag(flag, value) {
    const state = get();
    assert(isDefined(state.activeList), "no active list is defined.");

    const list = state.lists[state.activeList];
    assert(isDefined(list), `list ${state.activeList} not defined.`);

    set({
      lists: {
        ...state.lists,
        [state.activeList]: {
          ...list,
          search: {
            ...list.search,
            [flag]: value,
          },
        },
      },
    });
  },

  setSearchValue(value) {
    const state = get();
    assert(isDefined(state.activeList), "no active list is defined.");

    const list = state.lists[state.activeList];
    assert(isDefined(list), `list ${state.activeList} not defined.`);

    set({
      lists: {
        ...state.lists,
        [state.activeList]: {
          ...list,
          search: {
            ...list.search,
            value,
          },
        },
      },
    });
  },

  setFiltersEnabled(value) {
    const state = get();
    assert(isDefined(state.activeList), "no active list is defined.");

    const list = state.lists[state.activeList];
    assert(isDefined(list), `list ${state.activeList} not defined.`);

    set({
      lists: {
        ...state.lists,
        [state.activeList]: {
          ...list,
          filtersEnabled: value,
        },
      },
    });
  },

  addList(key, cardType, initialValues) {
    const state = get();

    const lists = { ...state.lists };
    assert(!lists[key], `list ${key} already exists.`);
    assert(cardType === "player", "only player lists are supported for now.");

    lists[key] = makePlayerCardsList(key, {
      showInvestigators: true,
      initialValues: {
        ...initialValues,
        ownership: getInitialOwnershipFilter(state),
        subtype: getInitialSubtypeFilter(state),
      },
    });

    set({
      lists,
    });
  },

  removeList(key) {
    const state = get();
    const lists = { ...state.lists };
    delete lists[key];

    set({
      lists,
    });
  },
});

function makeSearch(): Search {
  return {
    value: "",
    includeGameText: false,
    includeFlavor: false,
    includeBacks: false,
  };
}

function makeFilterObject<K extends FilterKey>(
  type: K,
  value: FilterMapping[K],
  open = false,
) {
  return {
    open,
    type,
    value,
  };
}

function makeFilterValue(
  type: FilterKey,
  cardType: List["cardType"],
  initialValue?: unknown,
) {
  switch (type) {
    case "asset": {
      return makeFilterObject(
        type,
        isAssetFilter(initialValue)
          ? initialValue
          : {
              health: undefined,
              sanity: undefined,
              skillBoosts: [],
              slots: [],
              uses: [],
              healthX: false,
            },
      );
    }

    case "cost": {
      return makeFilterObject(
        type,
        isCostFilter(initialValue)
          ? initialValue
          : {
              range: undefined,
              even: false,
              odd: false,
              x: false,
            },
      );
    }

    case "level": {
      return makeFilterObject(
        type,
        isLevelFilter(initialValue)
          ? initialValue
          : {
              range: undefined,
              exceptional: false,
              nonexceptional: false,
            },
      );
    }

    case "action":
    case "encounterSet":
    case "pack":
    case "trait":
    case "type":
    case "faction": {
      return makeFilterObject(
        type,
        isMultiSelectFilter(initialValue) ? initialValue : [],
      );
    }

    case "subtype": {
      return makeFilterObject(
        type,
        isSubtypeFilter(initialValue) && cardType === "player"
          ? initialValue
          : {
              none: true,
              weakness: true,
              basicweakness: true,
            },
        cardType === "player" ? !initialValue : false,
      );
    }

    case "ownership": {
      return makeFilterObject(
        type,
        isOwnershipFilter(initialValue) ? initialValue : "all",
      );
    }

    case "properties": {
      return makeFilterObject(
        type,
        isPropertiesFilter(initialValue)
          ? initialValue
          : {
              bonded: false,
              customizable: false,
              seal: false,
              unique: false,
              fast: false,
              permanent: false,
              exile: false,
              healsDamage: false,
              healsHorror: false,
              victory: false,
              succeedBy: false,
            },
        true,
      );
    }

    case "investigator": {
      return makeFilterObject(
        type,
        typeof initialValue === "string" ? initialValue : undefined,
      );
    }

    case "tabooSet": {
      return makeFilterObject(
        type,
        typeof initialValue === "number" ? initialValue : undefined,
      );
    }

    case "skillIcons": {
      return makeFilterObject(
        "skillIcons",
        isSkillIconsFilter(initialValue)
          ? initialValue
          : {
              agility: undefined,
              combat: undefined,
              intellect: undefined,
              willpower: undefined,
              wild: undefined,
              any: undefined,
            },
      );
    }
  }
}

function makeList(
  key: string,
  cardType: List["cardType"],
  filters: FilterKey[],
  grouping: List["grouping"],
  sorting: List["sorting"],
  systemFilter?: Filter,
  initialValues?: Partial<Record<FilterKey, unknown>>,
  initialSearch?: Search,
): List {
  return {
    cardType,
    filters,
    filterValues: filters.reduce<List["filterValues"]>((acc, curr, i) => {
      acc[i] = makeFilterValue(curr, cardType, initialValues?.[curr]);
      return acc;
    }, {}),
    filtersEnabled: true,
    grouping,
    key,
    systemFilter,
    sorting,
    search: initialSearch ?? makeSearch(),
  };
}

function makePlayerCardsList(
  key: string,
  {
    initialValues = {} as Partial<Record<FilterKey, unknown>>,
    showInvestigators = false,
  } = {},
): List {
  const filters: FilterKey[] = [
    "faction",
    "type",
    "level",
    "ownership",
    "investigator",
    "subtype",
    "cost",
    "trait",
    "asset",
    "skillIcons",
    "properties",
    "action",
    "pack",
    "tabooSet",
  ];

  const systemFilter = [
    filterDuplicates,
    filterEncounterCards,
    filterMythosCards,
    filterBacksides,
  ];

  if (!showInvestigators) {
    filters.splice(filters.indexOf("investigator"), 1);
  }

  return makeList(
    key,
    "player",
    filters,
    ["subtype", "type", "slot"],
    ["name", "level"],
    and(systemFilter),
    initialValues,
  );
}

function makeInvestigatorCardsList(key: string): List {
  return makeList(
    key,
    "player",
    ["faction", "ownership"],
    ["cycle"],
    ["position"],
    and([filterType(["investigator"]), filterDuplicates, filterEncounterCards]),
  );
}

function makeEncounterCardsList(
  key: string,
  { initialValues = {} as Partial<Record<FilterKey, unknown>> } = {},
): List {
  const filters: FilterKey[] = [
    "faction",
    "type",
    "ownership",
    "cost",
    "trait",
    "subtype",
    "asset",
    "skillIcons",
    "properties",
    "action",
    "pack",
    "encounterSet",
  ];

  const systemFilter = [
    filterDuplicates,
    not(filterEncounterCards),
    filterBacksides,
  ];

  return makeList(
    key,
    "encounter",
    filters,
    ["encounter_set"],
    ["position"],
    and(systemFilter),
    initialValues,
  );
}

export function makeLists(initialValues?: Partial<Record<FilterKey, unknown>>) {
  return {
    browse_player: makePlayerCardsList("browse_player", {
      showInvestigators: true,
      initialValues,
    }),
    browse_encounter: makeEncounterCardsList("browse_encounter", {
      initialValues,
    }),
    create_deck: makeInvestigatorCardsList("create_deck"),
    editor_player: makePlayerCardsList("editor_player", {
      initialValues,
    }),
    editor_encounter: makeEncounterCardsList("editor_encounter", {
      initialValues,
    }),
  };
}

export function getInitialOwnershipFilter(state: StoreState): OwnershipFilter {
  return state.settings.showAllCards ? "all" : "owned";
}

export function getInitialSubtypeFilter(
  state: StoreState,
): SubtypeFilter | undefined {
  return state.settings.hideWeaknessesByDefault
    ? {
        none: true,
        weakness: false,
        basicweakness: false,
      }
    : undefined;
}
