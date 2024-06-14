export type Mapping<V extends string | number> = Record<string, V>;

export type LookupTable<
  T extends string | number,
  V extends string | number = 1,
> = Record<T, Mapping<V>>;

export type LookupTables = {
  actions: LookupTable<string>;
  cost: LookupTable<number>;
  encounter_code: LookupTable<string>;
  faction_code: LookupTable<string>;
  pack_code: LookupTable<string>;
  subtype_code: LookupTable<string>;
  health: LookupTable<number>;
  sanity: LookupTable<number>;
  type_code: LookupTable<string>;
  properties: {
    fast: Mapping<1>;
    multislot: Mapping<1>;
    bonded: Mapping<1>; // TODO: link the bonded card?
    seal: Mapping<1>; // TODO: link the tokens?
    multiclass: Mapping<1>;
  };
  skill_icons: LookupTable<string>;
  slots: LookupTable<string>;
  skill_boosts: LookupTable<string>;
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
