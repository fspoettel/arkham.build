import { StateCreator } from "zustand";
import { SharedSlice } from "./types";
import {
  queryCards,
  queryDataVersion,
  queryMetadata,
} from "@/store/graphql/queries";
import { StoreState } from "..";

export const createSharedSlice: StateCreator<
  StoreState,
  [],
  [],
  SharedSlice
> = (set, get) => ({
  async init() {
    console.time("init");
    console.time("query_data");
    const [metadata, dataVersion, cards] = await Promise.all([
      queryMetadata(),
      queryDataVersion(),
      queryCards(),
    ]);
    console.timeEnd("query_data");

    console.time("create_store_data");
    get().createIndexes(cards);
    get().setMetadata(dataVersion, metadata, cards);
    console.timeEnd("create_store_data");
    console.timeEnd("init");
  },
});
