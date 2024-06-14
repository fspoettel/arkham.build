export type Mapping<V extends string | number> = Record<string, V>;

export type LookupTable<
  T extends string | number,
  V extends string | number = 1,
> = Record<T, Mapping<V>>;

export type LookupTables = {
  // Tracks the data version the indexes were created for.
  dataVersion?: string;
  // TODO: add alternative_art investigators.
  relations: {
    // `Hallowed Mirror` has bound `Soothing Melody`.
    bound: LookupTable<string, 1>;
    // `Soothing Melody` is bonded to `Hallowed Mirror`.
    bonded: LookupTable<string, 1>;
    // `Daisy's Tote Bag` is restrictory to `Daisy Walker`.
    restrictedTo: LookupTable<string, 1>;
    // `Daisy Walker`'s requires `Daisy's Tote Bag`.
    requiredCards: LookupTable<string, 1>;
    // Roland bannks has parallel card "Directive".
    parallelCards: LookupTable<string, 1>;
    // Parallel versions of an investigator.
    parallel: LookupTable<string, 1>;
    // Advanced requiredCards for an investigator.
    advanced: LookupTable<string, 1>;
    // Replacement requiredCards for an investigator.
    replacement: LookupTable<string, 1>;
    // Any card can have `n` different level version. (e.g. Ancient Stone)
    level: LookupTable<string, 1>;
  };
  // used: filtering.
  typesByCardTypeSelection: LookupTable<string, 1>;
  // used: filtering.
  traitsByCardTypeSeletion: LookupTable<string, 1>;
  // used: grouping.
  encounterCode: LookupTable<string>;
  // used: grouping.
  typeCode: LookupTable<string>;
  // used: grouping.
  subtypeCode: LookupTable<string>;
  // used: filtering.
  actions: LookupTable<string>;
  // used: filtering.
  cost: LookupTable<number>;
  factionCode: LookupTable<string>;
  packCode: LookupTable<string>;
  health: LookupTable<number>;
  sanity: LookupTable<number>;
  properties: {
    // used: filtering.
    heals_damage: Mapping<1>;
    // used: filtering.
    heals_horror: Mapping<1>;
    // used: filtering.
    fast: Mapping<1>;
    // used: filtering.
    multislot: Mapping<1>;
    // used: filtering.
    seal: Mapping<1>; // TODO: link the tokens?
    // used: filtering.
    multiclass: Mapping<1>;
  };
  skillBoosts: LookupTable<string>;
  // used: grouping, filtering.
  // cards that occupy multiple slots are added to both slot entries and a separate grouped entry. They are also added to the `properties.multislot` index.
  slots: LookupTable<string>;
  // We initially query `all_cards` in a sorted fashion. Persist this as an index to allow cheap sort lookups.
  sort: {
    alphabetical: Mapping<number>;
  };
  // used: filtering.
  traits: LookupTable<string>;
  uses: LookupTable<string>;
  // used: filtering.
  level: LookupTable<number>;

  tabooSet: LookupTable<number>;
};

export type LookupTablesSlice = {
  lookupTables: LookupTables;
};
