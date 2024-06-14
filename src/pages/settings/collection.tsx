import { MouseEvent, useCallback, useEffect, useState } from "react";

import { LazyPackIcon } from "@/components/icons/lazy-icons";
import { Field } from "@/components/ui/field";
import { useStore } from "@/store";
import { selectCyclesAndPacks } from "@/store/selectors/settings";
import { SettingsState } from "@/store/slices/settings/types";

import css from "./collection.module.css";

import { CollectionCycleActions } from "./collection-cycle-actions";
import { CollectionPack } from "./collection-pack";

type Props = {
  settings: SettingsState;
};

export function Collection({ settings }: Props) {
  const cyclesWithPacks = useStore(selectCyclesAndPacks);

  const [collectionState, setCollectionState] = useState(settings.collection);

  useEffect(() => {
    setCollectionState(settings.collection);
  }, [settings]);

  const onCheckboxChange = useCallback((packCode: string, val: number) => {
    setCollectionState((prev) => ({ ...prev, [packCode]: val }));
  }, []);

  const onToggleCycle = useCallback(
    (evt: MouseEvent<HTMLButtonElement>) => {
      if (evt.currentTarget instanceof HTMLButtonElement) {
        const code = evt.currentTarget.dataset.cycle;
        const val = Number.parseInt(
          evt.currentTarget.dataset.val as string,
          10,
        );

        const cycle = cyclesWithPacks.find((c) => c.code === code);
        if (cycle) {
          setCollectionState((prev) => {
            const update = cycle.packs.reduce<SettingsState["collection"]>(
              (acc, curr) => {
                if (!curr.reprint) acc[curr.code] = val;
                return acc;
              },
              {},
            );

            return { ...prev, ...update };
          });
        }
      }
    },
    [cyclesWithPacks],
  );

  return (
    <>
      <Field>
        <fieldset className={css["collection"]} id="collection">
          <legend>Card collection</legend>
          <ol className={css["collection-cycles"]}>
            {cyclesWithPacks.map((cycle) => (
              <li className={css["collection-cycle"]} key={cycle.code}>
                <div className={css["collection-cycle-header"]}>
                  <div className={css["collection-cycle-label"]}>
                    <LazyPackIcon code={cycle.code} />
                    {cycle.real_name}
                  </div>
                  {!cycle.reprintPacks.length && cycle.code !== "core" && (
                    <CollectionCycleActions
                      cycleCode={cycle.code}
                      onToggleCycle={onToggleCycle}
                    />
                  )}
                </div>

                {!!cycle.reprintPacks.length && (
                  <div>
                    <div className={css["collection-cycle-subheader"]}>
                      New format
                    </div>
                    <ol className={css["collection-packs"]}>
                      {cycle.reprintPacks.map((pack) => (
                        <CollectionPack
                          pack={pack}
                          key={pack.code}
                          hasQuantity={pack.code === "core"}
                          onChange={onCheckboxChange}
                          cycle={cycle}
                          value={collectionState[pack.code] ?? 0}
                        />
                      ))}
                    </ol>
                  </div>
                )}

                <div>
                  {!!cycle.reprintPacks.length && (
                    <div className={css["collection-cycle-subheader"]}>
                      Old format
                      {cycle.code !== "core" && (
                        <CollectionCycleActions
                          cycleCode={cycle.code}
                          onToggleCycle={onToggleCycle}
                        />
                      )}
                    </div>
                  )}
                  <ol className={css["collection-packs"]}>
                    {cycle.packs.map((pack) => (
                      <CollectionPack
                        pack={pack}
                        key={pack.code}
                        hasQuantity={pack.code === "core"}
                        onChange={onCheckboxChange}
                        cycle={cycle}
                        value={collectionState[pack.code] ?? 0}
                      />
                    ))}
                  </ol>
                </div>
              </li>
            ))}
          </ol>
        </fieldset>
      </Field>
    </>
  );
}
