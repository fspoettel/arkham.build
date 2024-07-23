import { del, get, set } from "idb-keyval";
import type { IStorageBackend } from "./types";

export class IndexedDBBackend implements IStorageBackend {
  get(key: string) {
    return get(key);
  }

  del(key: string) {
    return del(key);
  }

  set(key: string, val: string) {
    return set(key, val);
  }
}
