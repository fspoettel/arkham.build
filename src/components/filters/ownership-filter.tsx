import { useStore } from "@/store";
import { selectActiveListFilter } from "@/store/selectors/lists";
import { isOwnershipFilterObject } from "@/store/slices/lists.type-guards";
import { assert } from "@/utils/assert";
import { FileCheckIcon, FileIcon, FileWarningIcon } from "lucide-react";
import {
  RadioButtonGroup,
  RadioButtonGroupItem,
} from "../ui/radio-button-group";
import type { FilterProps } from "./filters.types";
import { FilterContainer } from "./primitives/filter-container";
import { useFilterCallbacks } from "./primitives/filter-hooks";

export function OwnershipFilter({ id }: FilterProps) {
  const filter = useStore((state) => selectActiveListFilter(state, id));
  assert(isOwnershipFilterObject(filter), "filter must be an ownership filter");

  const { onChange, onOpenChange } = useFilterCallbacks(id);

  const changes =
    filter.value === "all"
      ? "All"
      : filter.value === "owned"
        ? "Owned"
        : "Unavailable";

  return (
    <FilterContainer
      alwaysShowFilterString
      filterString={changes}
      onOpenChange={onOpenChange}
      open={filter.open}
      title="Ownership"
    >
      <RadioButtonGroup
        icons
        onValueChange={onChange}
        value={filter.value ?? ""}
      >
        <RadioButtonGroupItem tooltip="All" value="all">
          <FileIcon />
        </RadioButtonGroupItem>
        <RadioButtonGroupItem tooltip="Owned" value="owned">
          <FileCheckIcon />
        </RadioButtonGroupItem>
        <RadioButtonGroupItem tooltip="Unavailable" value="unowned">
          <FileWarningIcon />
        </RadioButtonGroupItem>
      </RadioButtonGroup>
    </FilterContainer>
  );
}
