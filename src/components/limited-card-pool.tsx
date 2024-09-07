import { useResolvedDeck } from "@/utils/use-resolved-deck";
import { DefaultTooltip } from "./ui/tooltip";

import { useStore } from "@/store";
import { selectPackOptions } from "@/store/selectors/lists";
import type { Pack } from "@/store/services/queries.types";
import { useCallback, useMemo } from "react";
import css from "./limited-card-pool.module.css";
import { PackName } from "./pack-name";
import { Combobox } from "./ui/combobox/combobox";
import { Field } from "./ui/field";
import { Tag } from "./ui/tag";

export function LimitedCardPoolTag() {
  const ctx = useResolvedDeck();

  const metadata = useStore((state) => state.metadata);
  const cardPool = ctx?.resolvedDeck?.metaParsed.card_pool;

  if (!cardPool) return null;

  return (
    <DefaultTooltip
      options={{ placement: "bottom-start" }}
      tooltip={
        <ol className={css["packs"]}>
          {cardPool.split(",").map((packCode) => {
            const pack = metadata.packs[packCode];
            return pack ? (
              <li className={css["pack"]} key={packCode}>
                <PackName pack={pack} />
              </li>
            ) : null;
          })}
        </ol>
      }
    >
      <Tag as="li" size="xs">
        Limited pool
      </Tag>
    </DefaultTooltip>
  );
}

export function LimitedCardPoolField(props: {
  onValueChange: (value: string[]) => void;
  selectedItems: string[];
}) {
  const { onValueChange, selectedItems } = props;

  const packs = useStore(selectPackOptions);

  const items = useMemo(
    () =>
      packs.filter(
        (pack) =>
          pack.cycle_code !== "parallel" &&
          pack.cycle_code !== "promotional" &&
          pack.cycle_code !== "side_stories",
      ),
    [packs],
  );

  const packRenderer = useCallback(
    (pack: Pack) => <PackName pack={pack} />,
    [],
  );

  const packToString = useCallback(
    (pack: Pack) => pack.real_name.toLowerCase(),
    [],
  );

  return (
    <Field
      full
      padded
      helpText="Investigators, signature cards and story assets are not affected by this selection."
    >
      <Combobox
        id="card-pool-combobox"
        items={items}
        itemToString={packToString}
        label="Limited Pool"
        onValueChange={onValueChange}
        placeholder="Select packs..."
        renderItem={packRenderer}
        renderResult={packRenderer}
        showLabel
        selectedItems={selectedItems}
      />
    </Field>
  );
}
