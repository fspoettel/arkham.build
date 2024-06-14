import { useCallback } from "react";

import { useStore } from "@/store";
import {
  selectActiveListFilter,
  selectPackChanges,
  selectPackOptions,
} from "@/store/selectors/lists";
import type { Pack } from "@/store/services/queries.types";
import { isPackFilterObject } from "@/store/slices/lists.type-guards";
import { assert } from "@/utils/assert";

import PackIcon from "../icons/pack-icon";
import { MultiselectFilter } from "./primitives/multiselect-filter";

function PackName({ pack }: { pack: Pack }) {
  return (
    <>
      <PackIcon code={pack.code} />
      {pack.real_name}
    </>
  );
}

export function PackFilter({ id }: { id: number }) {
  const filter = useStore((state) => selectActiveListFilter(state, id));
  assert(
    isPackFilterObject(filter),
    `PackFilter instantiated with '${filter?.type}'`,
  );

  const changes = useStore((state) => selectPackChanges(state, filter.value));
  const options = useStore(selectPackOptions);

  const nameRenderer = useCallback(
    (pack: Pack) => <PackName pack={pack} />,
    [],
  );

  const itemToString = useCallback(
    (pack: Pack) => pack.real_name.toLowerCase(),
    [],
  );

  return (
    <MultiselectFilter
      changes={changes}
      id={id}
      itemToString={itemToString}
      nameRenderer={nameRenderer}
      open={filter.open}
      options={options}
      placeholder="Select pack..."
      title="Pack"
      value={filter.value}
    />
  );
}
