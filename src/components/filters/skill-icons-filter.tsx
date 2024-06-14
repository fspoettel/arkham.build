import { CheckboxGroup } from "../ui/checkboxgroup";

import css from "./skill-icons-filter.module.css";
import { useStore } from "@/store";
import {
  selectActiveCardType,
  selectActiveSkillIcons,
} from "@/store/selectors/filters";
import { SkillIcon } from "../ui/icons/skill-icon";
import { useCallback } from "react";
import { SkillIconsFilter as SkillIconsFilterT } from "@/store/slices/filters/types";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { Collapsible, CollapsibleContent } from "../ui/collapsible";

export function SkillIconsFilter() {
  const cardType = useStore(selectActiveCardType);
  const setFilter = useStore((state) => state.setActiveFilter);
  const skillIcons = useStore(selectActiveSkillIcons);

  const onToggleChange = useCallback(
    (key: keyof SkillIconsFilterT, val: string) => {
      setFilter(cardType, "skillIcons", key, val ? +val : null);
    },
    [setFilter, cardType],
  );

  return (
    <Collapsible title="Skill Icons">
      <CollapsibleContent>
        <CheckboxGroup className={css["skill-filter-icons"]} as="div">
          {Object.entries(skillIcons).map(([key, value]) => (
            <div className={css["skill-filter-icon"]} key={key}>
              <ToggleGroup
                className={css["skill-filter-icon-toggle"]}
                key={key}
                type="single"
                onValueChange={(val) =>
                  onToggleChange(key as keyof SkillIconsFilterT, val)
                }
                value={value ? value.toString() : ""}
              >
                <ToggleGroupItem size="small" value="1">
                  1+
                </ToggleGroupItem>
                <ToggleGroupItem size="small" value="2">
                  2+
                </ToggleGroupItem>
              </ToggleGroup>
              {key === "any" ? "any" : <SkillIcon skill={key} />}
            </div>
          ))}
        </CheckboxGroup>
      </CollapsibleContent>
    </Collapsible>
  );
}
