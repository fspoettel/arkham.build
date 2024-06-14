export type Mapping<V extends string | number> = Record<string, V>;

export type LookupTable<
  T extends string | number,
  V extends string | number = 1,
> = Record<T, Mapping<V>>;

export type LookupTables = {
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
  actions: LookupTable<string>;
  cost: LookupTable<number>;
  factionCode: LookupTable<string>;
  packCode: LookupTable<string>;
  health: LookupTable<number>;
  sanity: LookupTable<number>;
  properties: {
    fast: Mapping<1>;
    multislot: Mapping<1>;
    bonded: Mapping<1>; // TODO: link the bonded card?
    seal: Mapping<1>; // TODO: link the tokens?
    multiclass: Mapping<1>;
  };
  skillIcons: LookupTable<string>;
  skillBoosts: LookupTable<string>;
  // used: grouping, filtering.
  // cards that occupy multiple slots are added to both slot entries and a separate grouped entry. They are also added to the `properties.multislot` index.
  slots: LookupTable<string>;
  // We initially query `all_cards` in a sorted fashion. Persist this as an index to allow cheap sort lookups.
  sort: {
    alphabetical: Mapping<number>;
  };
  traits: LookupTable<string>;
  uses: LookupTable<string>;
  level: LookupTable<number>;
};

export type LookupTablesSlice = {
  lookupTables: LookupTables;
};
