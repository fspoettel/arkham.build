export interface IStorageBackend {
  get(key: string): Promise<string | null | undefined>;
  set(key: string, value: string): Promise<void>;
  del(key: string): Promise<void>;
}
