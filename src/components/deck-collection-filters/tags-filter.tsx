import { useCallback } from "react";

import { Combobox } from "@/components/ui/combobox/combobox";
import { useStore } from "@/store";
import {
  selectDeckFilterValue,
  selectTagsChanges,
  selectTagsInLocalDecks,
} from "@/store/selectors/deck-filters";
import type { Coded } from "@/store/services/queries.types";
import { capitalize } from "@/utils/formatting";
import { FilterContainer } from "../filters/primitives/filter-container";

export function TagsFilter() {
  const changes = useStore(selectTagsChanges);
  const options = useStore(selectTagsInLocalDecks);
  const open = useStore((state) => state.deckFilters.open.tags);
  const value = useStore((state) => selectDeckFilterValue(state, "tags"));

  const setFilterValue = useStore((state) => state.addDecksFilter);
  const setFilterOpen = useStore((state) => state.setDeckFilterOpen);
  const resetFilter = useStore((state) => state.resetFilter);

  const tagRenderer = (tag: Coded) => <>{capitalize(tag.code)}</>;

  const onReset = useCallback(() => {
    resetFilter("tags");
  }, [resetFilter]);

  const onOpenChange = useCallback(
    (val: boolean) => {
      setFilterOpen("tags", val);
    },
    [setFilterOpen],
  );

  const onChange = useCallback(
    (value: string[]) => {
      console.log("manu nanananan");
      setFilterValue("tags", value);
    },
    [setFilterValue],
  );

  return (
    <FilterContainer
      filterString={changes}
      onOpenChange={onOpenChange}
      onReset={onReset}
      open={open}
      title="Tags"
    >
      <Combobox
        autoFocus
        id="tag-deck-filter"
        items={options}
        label="Tag"
        onValueChange={onChange}
        placeholder="Select tag(s)"
        selectedItems={value}
        renderResult={tagRenderer}
        renderItem={tagRenderer}
      />
    </FilterContainer>
  );
}
