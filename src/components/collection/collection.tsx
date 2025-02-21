import PackIcon from "@/components/icons/pack-icon";
import { Field, FieldLabel } from "@/components/ui/field";
import { useStore } from "@/store";
import { selectCycleCardCounts } from "@/store/selectors/collection";
import { selectCyclesAndPacks } from "@/store/selectors/lists";
import type { SettingsState } from "@/store/slices/settings.types";
import { CYCLES_WITH_STANDALONE_PACKS } from "@/utils/constants";
import { displayPackName } from "@/utils/formatting";
import { isEmpty } from "@/utils/is-empty";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { CollectionCount } from "./collection-count";
import { CollectionCycleActions } from "./collection-cycle-actions";
import { CollectionPack } from "./collection-pack";
import css from "./collection.module.css";

type Props = {
  canShowCounts?: boolean;
  settings: SettingsState;
  updateSettings?: (settings: React.SetStateAction<SettingsState>) => void;
};

export function CollectionSettings(props: Props) {
  const { canShowCounts, settings, updateSettings } = props;

  const { t } = useTranslation();
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
        const reprint = evt.currentTarget.dataset.reprint === "true";

        const val = Number.parseInt(
          evt.currentTarget.dataset.val as string,
          10,
        );

        const cycle = cyclesWithPacks.find((c) => c.code === code);

        if (cycle) {
          const packs = reprint ? cycle.reprintPacks : cycle.packs;

          const update = packs.reduce<SettingsState["collection"]>(
            (acc, curr) => {
              acc[curr.code] = val;
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
        <strong>{t("settings.collection.card_collection")}</strong>
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
                <img
                  loading="lazy"
                  alt={`Cycle ${displayPackName(cycle)} backdrop`}
                  className={css["backdrop"]}
                  src={`/assets/cycles/${cycle.code}.avif`}
                />

                <div className={css["cycle-header-container"]}>
                  <div className={css["cycle-label"]}>
                    <PackIcon code={cycle.code} />
                    {displayPackName(cycle)}
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
              </div>

              {!isEmpty(cycle.reprintPacks) && (
                <div>
                  <div className={css["cycle-subheader"]}>
                    {t("settings.collection.new_format")}
                    {canEdit && cycle.code !== "core" && (
                      <CollectionCycleActions
                        cycleCode={cycle.code}
                        onToggleCycle={onToggleCycle}
                        reprint
                      />
                    )}
                  </div>
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
                {!isEmpty(cycle.reprintPacks) && (
                  <div className={css["cycle-subheader"]}>
                    {t("settings.collection.old_format")}
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
                      <h4 className={css["cycle-counts-title"]}>
                        {t("settings.collection.card_count")}
                      </h4>
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
