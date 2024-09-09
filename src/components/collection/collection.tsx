import { useCallback } from "react";

import PackIcon from "@/components/icons/pack-icon";
import { Field, FieldLabel } from "@/components/ui/field";
import { useStore } from "@/store";
import { selectCyclesAndPacks } from "@/store/selectors/lists";
import type { SettingsState } from "@/store/slices/settings.types";

import css from "./collection.module.css";

import { selectCycleCardCounts } from "@/store/selectors/collection";
import { CYCLES_WITH_STANDALONE_PACKS } from "@/utils/constants";
import { CollectionCount } from "./collection-count";
import { CollectionCycleActions } from "./collection-cycle-actions";
import { CollectionPack } from "./collection-pack";

type Props = {
  canShowCounts?: boolean;
  settings: SettingsState;
  updateSettings?: (settings: React.SetStateAction<SettingsState>) => void;
};

export function Collection(props: Props) {
  const { canShowCounts, settings, updateSettings } = props;
  const cyclesWithPacks = useStore(selectCyclesAndPacks);

  const canEdit = !!updateSettings;

  const onCheckPack = useCallback(
    (packCode: string, val: number) => {
      updateSettings?.((prev) => ({
        ...prev,
        collection: {
          ...prev.collection,
          [packCode]: val,
        },
      }));
    },
    [updateSettings],
  );

  const onToggleCycle = useCallback(
    (evt: React.MouseEvent) => {
      if (evt.currentTarget instanceof HTMLButtonElement) {
        const code = evt.currentTarget.dataset.cycle;
        const val = Number.parseInt(
          evt.currentTarget.dataset.val as string,
          10,
        );

        const cycle = cyclesWithPacks.find((c) => c.code === code);
        if (cycle) {
          const update = cycle.packs.reduce<SettingsState["collection"]>(
            (acc, curr) => {
              if (!curr.reprint) acc[curr.code] = val;
              return acc;
            },
            {},
          );

          updateSettings?.((prev) => ({
            ...prev,
            collection: {
              ...prev.collection,
              ...update,
            },
          }));
        }
      }
    },
    [cyclesWithPacks, updateSettings],
  );

  const counts = useStore((state) =>
    canShowCounts ? selectCycleCardCounts(state) : undefined,
  );

  return (
    <Field bordered>
      <FieldLabel className={css["collection-label"]} htmlFor="collection">
        <strong>Card collection</strong>
      </FieldLabel>
      <fieldset
        className={css["container"]}
        data-testid="settings-collection"
        name="collection"
        id="collection"
      >
        <ol className={css["cycles"]}>
          {cyclesWithPacks.map((cycle) => (
            <li className={css["cycle"]} key={cycle.code}>
              <div className={css["cycle-header"]}>
                <div className={css["cycle-label"]}>
                  <PackIcon code={cycle.code} />
                  {cycle.real_name}
                </div>
                {canEdit &&
                  !cycle.reprintPacks.length &&
                  cycle.code !== "core" && (
                    <CollectionCycleActions
                      cycleCode={cycle.code}
                      onToggleCycle={onToggleCycle}
                    />
                  )}
              </div>

              {!!cycle.reprintPacks.length && (
                <div>
                  <div className={css["cycle-subheader"]}>New format</div>
                  <ol className={css["packs"]}>
                    {cycle.reprintPacks.map((pack) => (
                      <CollectionPack
                        canEdit={canEdit}
                        canShowCounts={canShowCounts}
                        counts={counts}
                        cycle={cycle}
                        hasQuantity={pack.code === "core"}
                        key={pack.code}
                        onChange={onCheckPack}
                        pack={pack}
                        value={settings.collection[pack.code] ?? 0}
                      />
                    ))}
                  </ol>
                </div>
              )}

              <div>
                {!!cycle.reprintPacks.length && (
                  <div className={css["cycle-subheader"]}>
                    Old format
                    {canEdit && cycle.code !== "core" && (
                      <CollectionCycleActions
                        cycleCode={cycle.code}
                        onToggleCycle={onToggleCycle}
                      />
                    )}
                  </div>
                )}
                <ol className={css["packs"]}>
                  {cycle.packs.map((pack) => (
                    <CollectionPack
                      canEdit={canEdit}
                      canShowCounts={canShowCounts}
                      counts={counts}
                      cycle={cycle}
                      hasQuantity={pack.code === "core"}
                      key={pack.code}
                      onChange={onCheckPack}
                      pack={pack}
                      value={settings.collection[pack.code] ?? 0}
                    />
                  ))}
                </ol>
              </div>

              {canShowCounts &&
                counts &&
                !CYCLES_WITH_STANDALONE_PACKS.includes(cycle.code) && (
                  <article className={css["cycle-counts"]}>
                    <header>
                      <h4 className={css["cycle-counts-title"]}>Card count</h4>
                    </header>
                    <CollectionCount
                      counts={counts.cycles[cycle.code]}
                      type="cycle"
                    />
                  </article>
                )}
            </li>
          ))}
        </ol>
      </fieldset>
    </Field>
  );
}
