import { useMemo } from "react";

import { NONE, getGroupingKeyLabel } from "@/store/lib/grouping";
import type { ListState } from "@/store/selectors/lists";
import type { Metadata } from "@/store/slices/metadata.types";

import css from "./card-list-nav.module.css";

import type { ResolvedDeck } from "@/store/lib/types";
import type { ViewMode } from "@/store/slices/lists.types";
import { SlidersVertical } from "lucide-react";
import { LimitedCardPoolTag, SealedDeckTag } from "../limited-card-pool";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuSection } from "../ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Select } from "../ui/select";

type Props = {
  data: ListState | undefined;
  deck?: ResolvedDeck;
  metadata: Metadata;
  onSelectGroup: (evt: React.ChangeEvent<HTMLSelectElement>) => void;
  onViewModeChange: (viewMode: ViewMode) => void;
  viewMode: ViewMode;
};

export function CardListNav(props: Props) {
  const { data, metadata, onSelectGroup, onViewModeChange, viewMode } = props;

  const jumpToOptions = useMemo(
    () =>
      data?.groups.map((group, i) => {
        const count = data.groupCounts[i];

        const keys = group.key.split("|");
        const types = group.type.split("|");
        const isAsset = group.key.includes("asset");

        const groupLabel = keys
          .map((key, i) => {
            if (!isAsset && key === NONE) return null;
            const label = getGroupingKeyLabel(types[i], key, metadata);
            return label;
          })
          .filter(Boolean)
          .join(" · ");

        return {
          label: `${groupLabel} (${count})`,
          value: group.key,
        };
      }),
    [data, metadata],
  );

  if (data == null) return null;

  const filteredCount = data.totalCardCount - data.cards.length;

  return (
    <nav className={css["nav"]}>
      <output className={css["nav-stats"]}>
        <LimitedCardPoolTag />
        <SealedDeckTag />

        <span data-testid="cardlist-count">
          {data?.cards.length ?? 0} cards
        </span>
        <small className={css["nav-stats-filter-count"]}>
          <em>
            {filteredCount > 0 && ` (${filteredCount} hidden by filters)`}
          </em>
        </small>
      </output>
      <div className={css["nav-row"]}>
        {data && (
          <Select
            className={css["nav-jump"]}
            emptyLabel="Jump to..."
            onChange={onSelectGroup}
            options={jumpToOptions ?? []}
            variant="compressed"
            value=""
          />
        )}
        <Popover placement="bottom-end">
          <PopoverTrigger asChild>
            <Button
              className={css["nav-config"]}
              tooltip="List settings"
              data-test-id="card-list-config"
              variant="bare"
              iconOnly
            >
              <SlidersVertical />
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <DropdownMenu>
              <DropdownMenuSection title="Display">
                <RadioGroup value={viewMode} onValueChange={onViewModeChange}>
                  <RadioGroupItem value="compact">Compact</RadioGroupItem>
                  <RadioGroupItem value="card-text">
                    Compact with text
                  </RadioGroupItem>
                  <RadioGroupItem value="full-cards">Full cards</RadioGroupItem>
                  <RadioGroupItem value="scans">Scans</RadioGroupItem>
                </RadioGroup>
              </DropdownMenuSection>
            </DropdownMenu>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
}
