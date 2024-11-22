import { Combobox } from "@/components/ui/combobox/combobox";
import { useStore } from "@/store";
import {
  selectDeckFilterValue,
  selectTagsChanges,
  selectTagsInLocalDecks,
} from "@/store/selectors/deck-filters";
import type { Coded } from "@/store/services/queries.types";
import { capitalize, formatProviderName } from "@/utils/formatting";
import { useCallback } from "react";
import { FilterContainer } from "../filters/primitives/filter-container";

type Props = {
  containerClass?: string;
};

const tagRenderer = (tag: Coded) => (
  <>
    {tag.code === "arkhamdb"
      ? formatProviderName(tag.code)
      : capitalize(tag.code)}
  </>
);

export function DeckTagsFilter({ containerClass }: Props) {
  const changes = useStore(selectTagsChanges);
  const options = useStore(selectTagsInLocalDecks);
  const open = useStore((state) => state.deckFilters.open.tags);
  const value = useStore((state) => selectDeckFilterValue(state, "tags"));

  const setFilterValue = useStore((state) => state.addDecksFilter);
  const setFilterOpen = useStore((state) => state.setDeckFilterOpen);
  const resetFilter = useStore((state) => state.resetDeckFilter);

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
      setFilterValue("tags", value);
    },
    [setFilterValue],
  );

  return (
    !!Object.keys(options).length && (
      <FilterContainer
        className={containerClass}
        filterString={changes}
        onOpenChange={onOpenChange}
        onReset={onReset}
        open={open}
        title="Tags"
        data-testid="deck-tags-filter"
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
    )
  );
}
