import { Tables } from "tinybase/with-schemas/store";
import * as UiReact from "tinybase/ui-react/with-schemas";
import {
  NoValuesSchema,
} from "tinybase/with-schemas";

import { indexedByCode } from "./utils";

import cycles from "../data/cycles.json";
import encounters from "../data/encounters.json";
import factions from "../data/factions.json";
import packs from "../data/packs.json";
import subtypes from "../data/subtypes.json";
import types from "../data/types.json";

const cycleSchema = {
  code: {  type: "string" },
  name: { type: "string" },
  position: { type: "number" },
  size: { type: "number" },
} as const;

const encounterSchema = {
  code: { type: "string" },
  name: { type: "string" },
} as const;

const factionsSchema = {
  code: {  type: "string" },
  name: { type: "string" },
  is_primary: { type: "boolean" },
  octgn_id: { type: "string" }
} as const;

const packsSchema = {
  cdgb_id: { type: "number" },
  code: { type: "string" },
  cycle_code: { type: "string" },
  date_release: { type: "string" },
  name: { type: "string" },
  position: { type: "number" },
  size: { type: "number" },
} as const;

const subTypesSchema = {
  code: { type: "string" },
  name: { type: "string" },
} as const;

const typesSchema = {
  code: { type: "string" },
  name: { type: "string" },
} as const;

export const tableSchema = {
  cycles: cycleSchema,
  encounters: encounterSchema,
  factions: factionsSchema,
  packs: packsSchema,
  subTypes: subTypesSchema,
  types: typesSchema
} as const;

export function getInitialState(): Tables<typeof tableSchema, true> {
  return {
    cycles: indexedByCode(cycles),
    encounters: indexedByCode(encounters),
    // FIXME: handle null values.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    factions: indexedByCode(factions as any),
    // FIXME: handle undefined values.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    packs: indexedByCode(packs as any),
    subTypes: indexedByCode(subtypes),
    types: indexedByCode(types),
  };
}

const UiReactWithSchemas = UiReact as UiReact.WithSchemas<
  [typeof tableSchema, NoValuesSchema]
>;

export const {
  Provider,
  useCreatePersister,
  useCreateStore,
  useLocalRowIds,
  useRelationships,
  useRemoteRowId,
  useStore,
  useTable,
  useTables,
} = UiReactWithSchemas;
