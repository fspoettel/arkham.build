import { assert } from "@/utils/assert";
import { IndexedDBBackend } from "./indexeddb";
import { OpfsBackend } from "./opfs";
import type { IStorageBackend } from "./types";

export class StorageBackend implements IStorageBackend {
  backend: IStorageBackend | undefined;

  async getBackend() {
    if (this.backend) {
      return this.backend;
    }

    if (await OpfsBackend.isAvailable()) {
      this.backend = new OpfsBackend();
      console.debug("[storage] using opfs backend");
    } else {
      this.backend = new IndexedDBBackend();
      console.debug("[storage] using opfs backend");
    }

    return this.backend;
  }

  async set(key: string, value: string) {
    const backend = await this.getBackend();
    assert(backend, "backend is not available");
    return backend.set(key, value);
  }

  async get(key: string) {
    const backend = await this.getBackend();
    assert(backend, "backend is not available");
    return backend.get(key);
  }

  async del(key: string) {
    const backend = await this.getBackend();
    assert(backend, "backend is not available");
    return backend.del(key);
  }
}
