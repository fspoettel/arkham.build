export type SearchState = {
  search: {
    value: string;
    includeGameText: boolean;
    includeFlavor: boolean;
    includeBacks: boolean;
  };
};

export type SearchSlice = SearchState & {
  setSearchValue(value: string): void;
  setSearchFlag(
    flag: "includeGameText" | "includeFlavor" | "includeBacks",
    value: boolean,
  ): void;
};
