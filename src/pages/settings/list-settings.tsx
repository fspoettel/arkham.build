import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Sortable } from "@/components/ui/sortable";
import {
  ENCOUNTER_GROUPING_TYPES,
  PLAYER_GROUPING_TYPES,
} from "@/store/lib/grouping";
import { SORTING_TYPES } from "@/store/lib/sorting";
import { ENCOUNTER_DEFAULTS, PLAYER_DEFAULTS } from "@/store/slices/settings";
import type { SettingsState } from "@/store/slices/settings.types";
import { formatGroupingType } from "@/utils/formatting";
import type React from "react";
import { useCallback, useEffect, useState } from "react";
import css from "./settings.module.css";

type Props = {
  listKey: keyof SettingsState["lists"];
  settings: SettingsState;
  title: React.ReactNode;
  updateSettings: React.Dispatch<React.SetStateAction<SettingsState>>;
};

function getGroupItemsForList(listKey: keyof SettingsState["lists"]) {
  if (listKey === "encounter") {
    return [...ENCOUNTER_GROUPING_TYPES];
  }

  return [...PLAYER_GROUPING_TYPES];
}

function getDefaultsForList(listKey: keyof SettingsState["lists"]) {
  if (listKey === "encounter") {
    return structuredClone(ENCOUNTER_DEFAULTS);
  }

  return structuredClone(PLAYER_DEFAULTS);
}

export function ListSettings(props: Props) {
  const { listKey, settings, title, updateSettings } = props;

  const [version, setVersion] = useState(0);

  const resetToDefaults = useCallback(() => {
    updateSettings((settings) => ({
      ...settings,
      lists: {
        ...settings.lists,
        [listKey]: getDefaultsForList(listKey),
      },
    }));
    setVersion((v) => v + 1);
  }, [listKey, updateSettings]);

  return (
    <section className={css["list"]}>
      <header className={css["list-header"]}>
        <h3 className={css["list-title"]}>{title}</h3>
        <Button
          data-testid={`list-settings-reset-${listKey}`}
          onClick={resetToDefaults}
          size="sm"
          type="button"
        >
          Reset to default
        </Button>
      </header>
      <ListSettingsList
        activeItems={settings.lists[listKey].group}
        items={getGroupItemsForList(listKey)}
        listKey={listKey}
        subKey="group"
        updateSettings={updateSettings}
        title="Group by"
        version={version}
      />
      <ListSettingsList
        activeItems={settings.lists[listKey].sort}
        items={SORTING_TYPES}
        listKey={listKey}
        subKey="sort"
        updateSettings={updateSettings}
        title="Sort by"
        version={version}
      />
    </section>
  );
}

function sortListItems<T>(items: T[], activeItems: T[]) {
  return [...items].sort((a, b) => {
    let aIndex = activeItems.indexOf(a);
    let bIndex = activeItems.indexOf(b);

    if (aIndex === -1) aIndex = Number.MAX_SAFE_INTEGER;
    if (bIndex === -1) bIndex = Number.MAX_SAFE_INTEGER;

    return aIndex - bIndex;
  });
}

function ListSettingsList<T extends string>(props: {
  activeItems: T[];
  items: T[];
  listKey: keyof SettingsState["lists"];
  subKey: "sort" | "group";
  updateSettings: React.Dispatch<React.SetStateAction<SettingsState>>;
  title: React.ReactNode;
  version: number;
}) {
  const {
    activeItems,
    items,
    listKey,
    subKey,
    title,
    updateSettings,
    version,
  } = props;

  const [listItems, setListItems] = useState(sortListItems(items, activeItems));

  // biome-ignore lint/correctness/useExhaustiveDependencies: We only resort when necessary
  useEffect(() => {
    setListItems(sortListItems(items, activeItems));
  }, [version]);

  const updateOrder = useCallback(
    (active: T[]) => {
      updateSettings((settings) => ({
        ...settings,
        lists: {
          ...settings.lists,
          [listKey]: {
            ...settings.lists[listKey],
            [subKey]: active,
          },
        },
      }));
    },
    [updateSettings, listKey, subKey],
  );

  const onSort = useCallback(
    (sorted: T[]) => {
      setListItems(sorted);
      updateOrder(sorted.filter((g) => activeItems.includes(g)));
    },
    [updateOrder, activeItems],
  );

  const onCheckChange = useCallback(
    (type: T, checked: boolean) => {
      const active = items
        .filter((item) => {
          if (item !== type) return activeItems.includes(item);
          return checked;
        })
        .sort((a, b) => {
          return listItems.indexOf(a) - listItems.indexOf(b);
        });

      updateOrder(active);
    },
    [items, activeItems, updateOrder, listItems],
  );

  return (
    <article
      className={css["list-group"]}
      data-testid={`list-settings-${listKey}-${subKey}`}
    >
      <header className={css["list-group-header"]}>
        <h4 className={css["list-group-title"]}>{title}</h4>
      </header>
      <Sortable
        activeItems={activeItems}
        items={listItems}
        onSort={onSort}
        overlayClassName={css["list-overlay"]}
        renderItemContent={(type) => (
          <>
            <Checkbox
              data-testid={`${listKey}-${subKey}-${type}`}
              id={`${listKey}-${subKey}-${type}`}
              checked={activeItems.includes(type)}
              onCheckedChange={(checked) => onCheckChange(type, !!checked)}
              label={formatGroupingType(type)}
            />
          </>
        )}
      />
    </article>
  );
}
