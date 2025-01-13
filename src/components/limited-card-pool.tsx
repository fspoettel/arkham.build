import { useStore } from "@/store";
import type { SealedDeck } from "@/store/lib/types";
import { selectPackOptions } from "@/store/selectors/lists";
import type { Pack } from "@/store/services/queries.types";
import { assert } from "@/utils/assert";
import { parseCsv } from "@/utils/parse-csv";
import { useResolvedDeck } from "@/utils/use-resolved-deck";
import { BookLockIcon, XIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import css from "./limited-card-pool.module.css";
import { PackName } from "./pack-name";
import { Button } from "./ui/button";
import { Combobox } from "./ui/combobox/combobox";
import { Field, FieldLabel } from "./ui/field";
import { FileInput } from "./ui/file-input";
import { Tag } from "./ui/tag";
import { useToast } from "./ui/toast.hooks";
import {
  DefaultTooltip,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip";

export function LimitedCardPoolTag() {
  const ctx = useResolvedDeck();

  const metadata = useStore((state) => state.metadata);
  const cardPool = ctx.resolvedDeck?.metaParsed.card_pool;

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
                <PackName pack={pack} shortenNewFormat />
              </li>
            ) : null;
          })}
        </ol>
      }
    >
      <Tag as="li" size="xs" data-testid="limited-card-pool-tag">
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
    (pack: Pack) => <PackName pack={pack} shortenNewFormat />,
    [],
  );

  const packToString = useCallback(
    (pack: Pack) => pack.real_name.toLowerCase(),
    [],
  );

  return (
    <Field
      data-testid="limited-card-pool-field"
      full
      padded
      helpText="Investigators, signature cards and story assets are not affected by this selection."
    >
      <Combobox
        id="card-pool-combobox"
        items={items}
        itemToString={packToString}
        label="Limited pool"
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

export function SealedDeckField(props: {
  onValueChange: (payload: SealedDeck | undefined) => void;
  value?: SealedDeck;
}) {
  const { onValueChange, value } = props;

  const toast = useToast();

  const onChangeFile = useCallback(
    async (evt: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = evt.target;
      if (!files || !files.length) return;

      const file = files[0];
      const fileText = await file.text();

      try {
        const parsed = parseCsv(fileText);
        assert(
          parsed.every(isCardRow),
          "File is not a sealed deck definition.",
        );
        onValueChange({
          name: file.name.split(".csv")[0],
          cards: parsed.reduce(
            (acc, curr) => {
              acc[curr.code] = curr.quantity;
              return acc;
            },
            {} as Record<string, number>,
          ),
        });
      } catch (err) {
        toast.show({
          children:
            (err as Error)?.message ??
            "Unknown error while parsing sealed deck.",
          variant: "error",
          duration: 5000,
        });
      }
    },
    [onValueChange, toast.show],
  );

  return (
    <Field
      data-testid="sealed-deck-field"
      full
      padded
      helpText={
        <>
          Upload a sealed deck definition (.csv) to use it. Use{" "}
          <a
            href="https://www.arkhamsealed.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            ArkhamSealed
          </a>{" "}
          to generate a sealed deck.
        </>
      }
    >
      <FieldLabel as="div">Sealed</FieldLabel>
      <div className={css["sealed"]}>
        <div>
          <FileInput
            id="sealed-deck"
            accept="text/csv"
            onChange={onChangeFile}
            size="sm"
          >
            <BookLockIcon /> Add sealed deck
          </FileInput>
        </div>
        {value && (
          <Tag size="xs">
            {value.name} ({Object.keys(value.cards).length} cards)
            <Button
              data-testid="sealed-deck-remove"
              onClick={() => onValueChange(undefined)}
              iconOnly
              size="xs"
              variant="bare"
            >
              <XIcon />
            </Button>
          </Tag>
        )}
      </div>
    </Field>
  );
}

type CardRow = {
  code: string;
  quantity: number;
};

function isCardRow(x: unknown): x is CardRow {
  return (
    typeof x === "object" &&
    x != null &&
    "code" in x &&
    "quantity" in x &&
    typeof x.code === "string" &&
    typeof x.quantity === "string" &&
    x.code.length > 0 &&
    x.code.length < 10 &&
    Number.isSafeInteger(Number.parseInt(x.quantity, 10))
  );
}

export function SealedDeckTag() {
  const ctx = useResolvedDeck();

  const value = ctx.resolvedDeck?.sealedDeck;
  if (!value) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Tag size="xs">Sealed</Tag>
      </TooltipTrigger>
      <TooltipContent>
        {value.name} ({Object.keys(value.cards).length} cards)
      </TooltipContent>
    </Tooltip>
  );
}
