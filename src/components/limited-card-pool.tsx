import { useStore } from "@/store";
import type { SealedDeck } from "@/store/lib/types";
import {
  selectCyclesAndPacks,
  selectPackOptions,
} from "@/store/selectors/lists";
import type { Cycle, Pack } from "@/store/services/queries.types";
import { assert } from "@/utils/assert";
import { campaignPlayalongPacks } from "@/utils/campaign-playalong";
import { CYCLES_WITH_STANDALONE_PACKS } from "@/utils/constants";
import { displayPackName } from "@/utils/formatting";
import { isEmpty } from "@/utils/is-empty";
import { parseCsv } from "@/utils/parse-csv";
import { useResolvedDeck } from "@/utils/use-resolved-deck";
import { BookLockIcon, XIcon } from "lucide-react";
import { useCallback, useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { createSelector } from "reselect";
import { Link } from "wouter";
import { useShallow } from "zustand/react/shallow";
import css from "./limited-card-pool.module.css";
import { PackName } from "./pack-name";
import { Button } from "./ui/button";
import { Combobox } from "./ui/combobox/combobox";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { useDialogContextChecked } from "./ui/dialog.hooks";
import { Field, FieldLabel } from "./ui/field";
import { FileInput } from "./ui/file-input";
import { Modal, ModalContent } from "./ui/modal";
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
  const { t } = useTranslation();

  const cardPool = ctx.resolvedDeck?.metaParsed.card_pool;

  const selectedPacks = useStore(
    useShallow((state) =>
      selectPackOptions(state).filter((pack) => cardPool?.includes(pack.code)),
    ),
  );

  if (isEmpty(selectedPacks)) return null;

  return (
    <DefaultTooltip
      options={{ placement: "bottom-start" }}
      tooltip={
        <ol className={css["packs"]}>
          {selectedPacks.map((pack) => {
            return pack ? (
              <li className={css["pack"]} key={pack.code}>
                <PackName pack={pack} shortenNewFormat />
              </li>
            ) : null;
          })}
        </ol>
      }
    >
      <Tag as="li" size="xs" data-testid="limited-card-pool-tag">
        {t("deck.tags.limited_pool")}
      </Tag>
    </DefaultTooltip>
  );
}

export function LimitedCardPoolField(props: {
  onValueChange: (value: string[]) => void;
  selectedItems: string[];
}) {
  const { onValueChange, selectedItems } = props;
  const { t } = useTranslation();

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
    (pack: Pack) => displayPackName(pack).toLowerCase(),
    [],
  );

  return (
    <Dialog>
      <Field
        data-testid="limited-card-pool-field"
        full
        padded
        helpText={
          <>
            <p>{t("deck_edit.config.card_pool.help")}</p>
            <div className={css["cpa-actions"]}>
              <DialogTrigger asChild>
                <Button variant="link" size="xs">
                  {t("deck_edit.config.card_pool.use_preset")}
                </Button>
              </DialogTrigger>
              {!isEmpty(selectedItems) && (
                <Button
                  onClick={() => onValueChange([])}
                  size="xs"
                  variant="link"
                >
                  {t("common.clear")}
                </Button>
              )}
            </div>
          </>
        }
      >
        <Combobox
          id="card-pool-combobox"
          items={items}
          itemToString={packToString}
          label={t("deck_edit.config.card_pool.title")}
          onValueChange={onValueChange}
          placeholder={t("deck_edit.config.card_pool.placeholder")}
          renderItem={packRenderer}
          renderResult={packRenderer}
          showLabel
          selectedItems={selectedItems}
        />
      </Field>
      <DialogContent>
        <ChooseCampaignModal onValueChange={onValueChange} />
      </DialogContent>
    </Dialog>
  );
}

export function SealedDeckField(props: {
  onValueChange: (payload: SealedDeck | undefined) => void;
  value?: SealedDeck;
}) {
  const { onValueChange, value } = props;

  const { t } = useTranslation();
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
        <Trans
          t={t}
          i18nKey="deck_edit.config.sealed.help"
          components={{
            a: (
              // biome-ignore lint/a11y/useAnchorContent: interpolation.
              <a
                href="https://www.arkhamsealed.com/"
                target="_blank"
                rel="noopener noreferrer"
              />
            ),
          }}
        >
          Upload a sealed deck definition (.csv) to use it. Use{" "}
          <Link href="">ArkhamSealed</Link> to generate a sealed deck.
        </Trans>
      }
    >
      <FieldLabel as="div">{t("deck_edit.config.sealed.title")}</FieldLabel>
      <div className={css["sealed"]}>
        <div>
          <FileInput
            id="sealed-deck"
            accept="text/csv"
            onChange={onChangeFile}
            size="sm"
          >
            <BookLockIcon /> {t("deck_edit.config.sealed.add")}
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
  const { t } = useTranslation();

  const value = ctx.resolvedDeck?.sealedDeck;
  if (!value) return null;

  const count = Object.keys(value.cards).length;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Tag size="xs">{t("deck.tags.sealed")}</Tag>
      </TooltipTrigger>
      <TooltipContent>
        {value.name} ({count} {t("common.card", { count })})
      </TooltipContent>
    </Tooltip>
  );
}

const selectCampaignCycles = createSelector(selectCyclesAndPacks, (cycles) =>
  cycles.filter((cycle) => !CYCLES_WITH_STANDALONE_PACKS.includes(cycle.code)),
);

function ChooseCampaignModal(props: {
  onValueChange: (items: string[]) => void;
}) {
  const { onValueChange } = props;
  const { t } = useTranslation();

  const dialogCtx = useDialogContextChecked();
  const cycles = useStore(selectCampaignCycles);

  const packRenderer = useCallback(
    (cycle: Cycle) => <PackName pack={cycle} shortenNewFormat />,
    [],
  );

  const packToString = useCallback(
    (pack: Cycle) => displayPackName(pack).toLowerCase(),
    [],
  );

  const selectCampaign = useCallback(
    (selection: string[]) => {
      if (!selection.length) return;
      const cycle = selection[0];

      const packs = campaignPlayalongPacks(cycle);
      onValueChange(packs);
      dialogCtx.setOpen(false);
    },
    [onValueChange, dialogCtx.setOpen],
  );

  const selectedItems = useMemo(() => [], []);

  return (
    <Modal size="60rem">
      <ModalContent title={t("deck_edit.config.card_pool.choose_campaign")}>
        <Field
          full
          padded
          bordered
          helpText={t("deck_edit.config.card_pool.cpa_help")}
        >
          <Combobox
            autoFocus
            id="campaign-playalong-combobox"
            limit={1}
            placeholder={t(
              "deck_edit.config.card_pool.choose_campaign_placeholder",
            )}
            renderItem={packRenderer}
            renderResult={packRenderer}
            itemToString={packToString}
            onValueChange={selectCampaign}
            items={cycles}
            label={t("deck_edit.config.card_pool.campaign")}
            showLabel
            selectedItems={selectedItems}
          />
        </Field>
      </ModalContent>
    </Modal>
  );
}
