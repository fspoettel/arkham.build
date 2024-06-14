export type Mapping<V extends string | number> = Record<string, V>;

export type LookupTable<
  T extends string | number,
  V extends string | number = 1,
> = Record<T, Mapping<V>>;

export type LookupTables = {
  // used: filtering.
  types_by_card_type_selection: LookupTable<string, 1>;
  traits_by_card_type_selection: LookupTable<string, 1>;
  // used: grouping.
  encounter_code: LookupTable<string>;
  // used: grouping.
  type_code: LookupTable<string>;
  // used: grouping.
  subtype_code: LookupTable<string>;
  actions: LookupTable<string>;
  cost: LookupTable<number>;
  faction_code: LookupTable<string>;
  pack_code: LookupTable<string>;
  health: LookupTable<number>;
  sanity: LookupTable<number>;
  properties: {
    fast: Mapping<1>;
    multislot: Mapping<1>;
    bonded: Mapping<1>; // TODO: link the bonded card?
    seal: Mapping<1>; // TODO: link the tokens?
    multiclass: Mapping<1>;
  };
  skill_icons: LookupTable<string>;
  skill_boosts: LookupTable<string>;
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
