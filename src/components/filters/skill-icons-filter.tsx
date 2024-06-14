import { useCallback } from "react";

import { useStore } from "@/store";
import { selectActiveCardType } from "@/store/selectors/filters/shared";
import { selectActiveSkillIcons } from "@/store/selectors/filters/skill-icons";
import { SkillIconsFilter as SkillIconsFilterT } from "@/store/slices/filters/types";

import css from "./skill-icons-filter.module.css";

import { SkillIcon } from "../icons/skill-icon";
import { CheckboxGroup } from "../ui/checkboxgroup";
import { Collapsible, CollapsibleContent } from "../ui/collapsible";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";

export function SkillIconsFilter() {
  const cardType = useStore(selectActiveCardType);
  const skillIcons = useStore(selectActiveSkillIcons);
  const setFilter = useStore((state) => state.setActiveFilter);

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
