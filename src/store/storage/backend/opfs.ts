import * as Comlink from "comlink";
import type { OPFSWorker } from "./opfs.worker";
import type { IStorageBackend } from "./types";

export class OpfsBackend implements IStorageBackend {
  worker: Comlink.Remote<OPFSWorker>;

  constructor() {
    const worker = new Worker(new URL("./opfs.worker.ts", import.meta.url), {
      type: "module",
    });

    this.worker = Comlink.wrap(worker);
  }

  async get(key: string) {
    console.debug("opfs get", key);
    const val = await this.worker.get(key);
    console.debug("opfs get success", key);
    return val;
  }

  async del(key: string) {
    console.debug("opfs del", key);
    await this.worker.del(key);
    console.debug("opfs del success", key);
  }

  async set(key: string, val: string) {
    console.debug("opfs set", key);
    await this.worker.set(key, val);
    console.debug("opfs set success", key);
  }

  static async isAvailable() {
    try {
      await navigator.storage.getDirectory();
      return true;
    } catch {
      return false;
    }
  }
}
