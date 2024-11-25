import { assert } from "@/utils/assert";
import type { StoreState } from "../slices";
import { VERSION, migrate, partialize } from "../storage";

type Backup = { data: StoreState; version: number };

export function prepareBackup(state: StoreState) {
  const data: Record<string, unknown> = partialize(state);
  data.metadata = undefined;

  const backup = JSON.stringify({
    version: VERSION,
    data,
  });

  return backup;
}

export async function restoreBackup(
  state: StoreState,
  buffer: File,
): Promise<StoreState> {
  const file = JSON.parse(await buffer.text());
  assert(validateBackup(file), "Invalid backup file.");
  return { ...state, ...migrate(file.data, file.version) };
}

function validateBackup(x: unknown): x is Backup {
  return (
    typeof x === "object" &&
    x != null &&
    "version" in x &&
    "data" in x &&
    typeof x.version === "number" &&
    typeof x.data === "object" &&
    x.data != null &&
    "app" in x.data &&
    "data" in x.data &&
    "settings" in x.data
  );
}
