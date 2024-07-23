import * as Comlink from "comlink";

// https://developer.mozilla.org/en-US/docs/Web/API/FileSystemSyncAccessHandle
type AccessHandle = {
  close(): void;
  flush(): void;
  getSize(): number;
  read(dataView: ArrayBuffer | ArrayBufferView, opts?: { at: number }): void;
  truncate(size: number): void;
  write(dataView: ArrayBuffer | ArrayBufferView, opts?: { at: number }): void;
};

type FileSystemHandle = FileSystemFileHandle & {
  createSyncAccessHandle(): Promise<AccessHandle>;
};

export type OPFSWorker = {
  get(key: string): Promise<string | undefined>;
  set(key: string, value: string): Promise<void>;
  del(key: string): Promise<void>;
};

async function getAccessHandle(key: string) {
  const opfsRoot = await navigator.storage.getDirectory();

  const fileHandle = await opfsRoot.getFileHandle(`${key}.json`, {
    create: true,
  });

  const accessHandle = await (
    fileHandle as FileSystemHandle
  ).createSyncAccessHandle();
  return accessHandle as AccessHandle;
}

const worker: OPFSWorker = {
  async get(key: string) {
    const accessHandle = await getAccessHandle(key);

    const size = accessHandle.getSize();

    const dataView = new DataView(new ArrayBuffer(size));
    accessHandle.read(dataView);

    const textDecoder = new TextDecoder();
    const text = textDecoder.decode(dataView);

    accessHandle.close();

    return text;
  },
  async set(key: string, value: string) {
    const accessHandle = await getAccessHandle(key);

    accessHandle.truncate(0);

    const textEncoder = new TextEncoder();

    accessHandle.write(textEncoder.encode(value), { at: 0 });
    accessHandle.flush();
    accessHandle.close();
  },
  async del(key: string) {
    const opfsRoot = await navigator.storage.getDirectory();
    try {
      await opfsRoot.removeEntry(`${key}.json`);
    } catch {
      // ignore
    }
  },
};

Comlink.expose(worker);
