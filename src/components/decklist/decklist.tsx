import { useStore } from "@/store";
import { type DeckGrouping, countGroupRows } from "@/store/lib/deck-grouping";
import type { ResolvedDeck } from "@/store/lib/types";
import { selectDeckGroups } from "@/store/selectors/decks";
import type { Card } from "@/store/services/queries.types";
import { isEmpty } from "@/utils/is-empty";
import { useHotkey } from "@/utils/use-hotkey";
import { LayoutGridIcon, LayoutListIcon } from "lucide-react";
import { useCallback } from "react";
import { AnnotationIndicator } from "../annotation-indicator";
import {
  Attachments,
  getMatchingAttachables,
} from "../attachments/attachments";
import { AllAttachables } from "../deck-tools/all-attachables";
import { LimitedSlots } from "../deck-tools/limited-slots";
import { HotkeyTooltip } from "../ui/hotkey";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { DecklistGroup } from "./decklist-groups";
import { DecklistSection } from "./decklist-section";
import css from "./decklist.module.css";
import type { ViewMode } from "./decklist.types";

const LABELS: Record<string, string> = {
  slots: "Cards",
  sideSlots: "Side deck",
  bondedSlots: "Bonded cards",
  extraSlots: "Extra deck",
};

type Props = {
  deck: ResolvedDeck;
  setViewMode: (mode: ViewMode) => void;
  viewMode: ViewMode;
};

export function Decklist(props: Props) {
  const { deck, setViewMode, viewMode } = props;

  const groups = useStore((state) => selectDeckGroups(state, deck, viewMode));

  const renderCardExtra = useCallback(
    (card: Card) => {
      const isAttached = !isEmpty(getMatchingAttachables(card, deck));
      const annotation = deck.annotations[card.code];

      return !!annotation || isAttached ? (
        <>
          {isAttached && (
            <Attachments
              card={card}
              resolvedDeck={deck}
              buttonVariant={viewMode === "scans" ? "bare" : undefined}
            />
          )}
          {viewMode === "scans" && annotation && <AnnotationIndicator />}
        </>
      ) : null;
    },
    [deck, viewMode],
  );

  const getListCardProps = useCallback(
    () => ({ renderCardExtra }),
    [renderCardExtra],
  );

  const hasAdditional =
    groups.bondedSlots || groups.extraSlots || groups.sideSlots;

  const onSetViewMode = useCallback(
    (mode: ViewMode) => {
      if (mode) setViewMode(mode as ViewMode);
    },
    [setViewMode],
  );

  useHotkey("alt+s", () => onSetViewMode("scans"));
  useHotkey("alt+l", () => onSetViewMode("list"));

  return (
    <article className={css["decklist-container"]}>
      <nav className={css["decklist-nav"]}>
        <ToggleGroup
          type="single"
          value={viewMode}
          onValueChange={onSetViewMode}
        >
          <HotkeyTooltip keybind="alt+l" description="Display as list">
            <ToggleGroupItem value="list">
              <LayoutListIcon /> List
            </ToggleGroupItem>
          </HotkeyTooltip>
          <HotkeyTooltip keybind="alt+s" description="Display as scans">
            <ToggleGroupItem value="scans">
              <LayoutGridIcon /> Scans
            </ToggleGroupItem>
          </HotkeyTooltip>
        </ToggleGroup>
      </nav>

      <div className={css["decklist"]} data-testid="view-decklist">
        {groups.slots && (
          <DecklistSection
            title={LABELS["main"]}
            columns={getColumnMode(viewMode, groups.slots)}
          >
            <DecklistGroup
              deck={deck}
              grouping={groups.slots}
              getListCardProps={getListCardProps}
              viewMode={viewMode}
            />
          </DecklistSection>
        )}

        {hasAdditional && (
          <div className={css["decklist-additional"]}>
            {groups.sideSlots && (
              <DecklistSection
                columns={getColumnMode(viewMode, groups.sideSlots)}
                showTitle
                title={LABELS["sideSlots"]}
              >
                <DecklistGroup
                  deck={deck}
                  grouping={groups.sideSlots}
                  getListCardProps={getListCardProps}
                  viewMode={viewMode}
                />
              </DecklistSection>
            )}
            {groups.bondedSlots && (
              <DecklistSection
                columns={getColumnMode(viewMode, groups.bondedSlots)}
                title={LABELS["bondedSlots"]}
                showTitle
              >
                <DecklistGroup
                  deck={deck}
                  grouping={groups.bondedSlots}
                  getListCardProps={getListCardProps}
                  viewMode={viewMode}
                />
              </DecklistSection>
            )}

            {groups.extraSlots && (
              <DecklistSection
                columns={getColumnMode(viewMode, groups.extraSlots)}
                title={LABELS["extraSlots"]}
                showTitle
              >
                <DecklistGroup
                  deck={deck}
                  grouping={groups.extraSlots}
                  getListCardProps={getListCardProps}
                  viewMode={viewMode}
                />
              </DecklistSection>
            )}
          </div>
        )}

        <div className={css["decklist-tools"]}>
          <LimitedSlots deck={deck} />
          <AllAttachables deck={deck} readonly />
        </div>
      </div>
    </article>
  );
}

function getColumnMode(viewMode: ViewMode, group: DeckGrouping) {
  if (viewMode === "scans") return "scans";
  return countGroupRows(group) < 5 ? "single" : "auto";
}
