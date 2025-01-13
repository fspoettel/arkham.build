import { useStore } from "@/store";
import {
  selectActiveListFilter,
  selectPackChanges,
  selectPackOptions,
} from "@/store/selectors/lists";
import type { Pack } from "@/store/services/queries.types";
import { isPackFilterObject } from "@/store/slices/lists.type-guards";
import { assert } from "@/utils/assert";
import { useResolvedDeck } from "@/utils/use-resolved-deck";
import { useCallback, useMemo } from "react";
import { PackName } from "../pack-name";
import type { FilterProps } from "./filters.types";
import { MultiselectFilter } from "./primitives/multiselect-filter";

export function PackFilter({ id }: FilterProps) {
  const ctx = useResolvedDeck();

  const filter = useStore((state) => selectActiveListFilter(state, id));
  assert(
    isPackFilterObject(filter),
    `PackFilter instantiated with '${filter?.type}'`,
  );

  const changes = useStore((state) => selectPackChanges(state, filter.value));
  const packOptions = useStore(selectPackOptions);

  const options = useMemo(
    () =>
      packOptions.filter((pack) => {
        const cardPool = ctx.resolvedDeck?.metaParsed?.card_pool;
        return cardPool
          ? cardPool.includes(pack.code) || filter.value.includes(pack.code)
          : true;
      }),
    [filter.value, ctx.resolvedDeck, packOptions],
  );

  const nameRenderer = useCallback(
    (pack: Pack) => <PackName pack={pack} shortenNewFormat />,
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
