import * as UiReact from "tinybase/ui-react/with-schemas";
import { tableSchema, valuesSchema } from "./schema";

const UiReactWithSchemas = UiReact as UiReact.WithSchemas<
  [typeof tableSchema, typeof valuesSchema]
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
  useRowIds,
  useSortedRowIds,
  useRow,
} = UiReactWithSchemas;
