import { useStore } from "@/store";
import {
  selectActiveListFilter,
  selectTraitChanges,
} from "@/store/selectors/lists";
import { selectTraitOptions } from "@/store/selectors/lists";
import { isTraitFilterObject } from "@/store/slices/lists.type-guards";
import { assert } from "@/utils/assert";
import { useTranslation } from "react-i18next";
import type { FilterProps } from "./filters.types";
import { MultiselectFilter } from "./primitives/multiselect-filter";

export function TraitFilter({ id, resolvedDeck }: FilterProps) {
  const { t } = useTranslation();
  const filter = useStore((state) => selectActiveListFilter(state, id));

  assert(
    isTraitFilterObject(filter),
    `PackFilter instantiated with '${filter?.type}'`,
  );

  const changes = selectTraitChanges(filter.value);
  const options = useStore((state) => selectTraitOptions(state, resolvedDeck));

  return (
    <MultiselectFilter
      changes={changes}
      id={id}
      open={filter.open}
      options={options}
      placeholder={t("filters.trait.placeholder")}
      title={t("common.trait", { count: 1 })}
      value={filter.value}
    />
  );
}
