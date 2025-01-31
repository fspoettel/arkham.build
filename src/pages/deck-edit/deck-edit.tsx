import { ListLayout } from "@//layouts/list-layout";
import {
  Attachments,
  getMatchingAttachables,
} from "@/components/attachments/attachments";
import { CardListContainer } from "@/components/card-list/card-list-container";
import { CardModalProvider } from "@/components/card-modal/card-modal-context";
import { CardRecommender } from "@/components/card-recommender/card-recommender";
import { CoreCardCheckbox } from "@/components/card-recommender/core-card-checkbox";
import { DeckTools } from "@/components/deck-tools/deck-tools";
import { DecklistValidation } from "@/components/decklist/decklist-validation";
import { Filters } from "@/components/filters/filters";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast.hooks";
import { ListLayoutContextProvider } from "@/layouts/list-layout-context-provider";
import { useStore } from "@/store";
import {
  selectDeckValid,
  selectResolvedDeckById,
} from "@/store/selectors/decks";
import {
  selectActiveList,
  selectAvailableUpgrades,
} from "@/store/selectors/lists";
import type { Card } from "@/store/services/queries.types";
import { type Tab, mapTabToSlot } from "@/store/slices/deck-edits.types";
import { isStaticInvestigator } from "@/utils/card-utils";
import { SPECIAL_CARD_CODES } from "@/utils/constants";
import { isEmpty } from "@/utils/is-empty";
import { useAccentColor } from "@/utils/use-accent-color";
import { useDocumentTitle } from "@/utils/use-document-title";
import { useHotkey } from "@/utils/use-hotkey";
import {
  ResolvedDeckProvider,
  useResolvedDeckChecked,
} from "@/utils/use-resolved-deck";
import {
  BookOpenTextIcon,
  ChartAreaIcon,
  CircleArrowUpIcon,
  LayoutListIcon,
  UndoIcon,
  WandSparklesIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "wouter";
import { Error404 } from "../errors/404";
import css from "./deck-edit.module.css";
import { DrawBasicWeakness } from "./editor/draw-basic-weakness";
import { Editor } from "./editor/editor";
import { MoveToMainDeck } from "./editor/move-to-main-deck";
import { NotesEditor } from "./editor/notes-editor";
import { ShowUnusableCardsToggle } from "./show-unusable-cards-toggle";

function DeckEdit() {
  const { id } = useParams<{ id: string }>();

  const toast = useToast();
  const activeListId = useStore((state) => state.activeList);
  const resetFilters = useStore((state) => state.resetFilters);
  const setActiveList = useStore((state) => state.setActiveList);
  const discardEdits = useStore((state) => state.discardEdits);
  const deck = useStore((state) => selectResolvedDeckById(state, id, true));
  const changes = useStore((state) => state.deckEdits[id]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: we only want to run this effect once on mount.
  useEffect(() => {
    let toastId: string | null = null;

    if (changes) {
      toastId = toast.show({
        children({ onClose }) {
          return (
            <>
              Unsaved changes were restored.
              <div className={css["restore"]}>
                <Button onClick={onClose} size="sm">
                  OK
                </Button>
                <Button
                  onClick={() => {
                    discardEdits(id);
                    onClose();
                  }}
                  size="sm"
                >
                  <UndoIcon />
                  Undo
                </Button>
              </div>
            </>
          );
        },
        variant: "success",
      });
    }

    return () => {
      if (toastId) {
        toast.dismiss(toastId);
      }
    };
  }, [discardEdits, id, toast]);

  useEffect(() => {
    setActiveList("editor_player");

    return () => {
      resetFilters();
    };
  }, [setActiveList, resetFilters]);

  if (id && !deck) {
    return <Error404 />;
  }

  if (!deck || !activeListId?.startsWith("editor")) return null;

  return (
    <ResolvedDeckProvider
      canEdit={!isStaticInvestigator(deck.investigatorBack.card)}
      resolvedDeck={deck}
    >
      <CardModalProvider>
        <DeckEditInner />
      </CardModalProvider>
    </ResolvedDeckProvider>
  );
}

function DeckEditInner() {
  const { canEdit, resolvedDeck: deck } = useResolvedDeckChecked();

  useDocumentTitle(deck ? `Edit: ${deck.name}` : "");

  const [currentTab, setCurrentTab] = useState<Tab>("slots");
  const [currentTool, setCurrentTool] = useState<string>("card-list");

  const tabs = useMemo(() => {
    const tabs = [
      {
        label: "Deck",
        value: "slots",
        type: "deck",
        hotkey: "d",
        hotkeyLabel: "Cycle decks",
      },
      {
        label: "Side",
        value: "sideSlots",
        type: "deck",
        hotkey: "d",
        hotkeyLabel: "Cycle decks",
      },
    ];

    if (deck.hasExtraDeck) {
      tabs.push({
        label: "Spirits",
        value: "extraSlots",
        type: "deck",
        hotkey: "d",
        hotkeyLabel: "Cycle decks",
      });
    }

    tabs.push({
      label: "Meta",
      value: "meta",
      type: "app",
      hotkey: "m",
      hotkeyLabel: "Deck meta",
    });

    return tabs;
  }, [deck.hasExtraDeck]);

  const activeList = useStore(selectActiveList);
  const updateCardQuantity = useStore((state) => state.updateCardQuantity);
  const validation = useStore((state) => selectDeckValid(state, deck));

  const accentColor = useAccentColor(deck.investigatorBack.card.faction_code);

  const availableUpgrades = useStore((state) =>
    selectAvailableUpgrades(
      state,
      deck,
      currentTab === "extraSlots" ? "extraSlots" : "slots",
    ),
  );

  const onChangeCardQuantity = useMemo(() => {
    return (card: Card, quantity: number, limit: number) => {
      updateCardQuantity(
        deck.id,
        card.code,
        quantity,
        limit,
        mapTabToSlot(currentTab),
      );
    };
  }, [updateCardQuantity, currentTab, deck.id]);

  const onCycleDeck = useCallback(() => {
    const deckTabs = tabs.filter((tab) => tab.type === "deck");
    const currentIndex = deckTabs.findIndex((tab) => tab.value === currentTab);
    const nextIndex = (currentIndex + 1) % deckTabs.length;
    setCurrentTab(deckTabs[nextIndex].value as Tab);
  }, [currentTab, tabs]);

  const onSetMeta = useCallback(() => {
    setCurrentTab("meta");
  }, []);

  useHotkey("d", onCycleDeck);
  useHotkey("m", onSetMeta);

  const renderCardExtraSlots = useCallback(
    (card: Card, quantity: number | undefined) => {
      if (card.code === SPECIAL_CARD_CODES.RANDOM_BASIC_WEAKNESS) {
        return (
          <DrawBasicWeakness
            deckId={deck.id}
            quantity={quantity}
            targetDeck={mapTabToSlot(currentTab)}
          />
        );
      }

      const hasAttachable =
        currentTab === "slots" && !isEmpty(getMatchingAttachables(card, deck));
      const hasUpgrades = !isEmpty(availableUpgrades[card.code]);

      if (!hasAttachable && !hasUpgrades) {
        return null;
      }

      return (
        <div className={css["extra-row"]}>
          {hasAttachable && <Attachments card={card} resolvedDeck={deck} />}
          {hasUpgrades && (
            <Button iconOnly size="sm" tooltip="Upgrade card">
              <CircleArrowUpIcon />
            </Button>
          )}
        </div>
      );
    },
    [deck, currentTab, availableUpgrades],
  );

  const renderMoveToMainDeck = useMemo(
    () =>
      canEdit
        ? (card: Card) =>
            deck.sideSlots?.[card.code] ? (
              <MoveToMainDeck card={card} deck={deck} />
            ) : undefined
        : undefined,
    [deck, canEdit],
  );

  const renderCoreCardCheckbox = useCallback(
    (card: Card, quantity?: number) => {
      if (card.xp == null || !quantity) return null;
      return <CoreCardCheckbox card={card} deck={deck} />;
    },
    [deck],
  );

  const getListCardProps = useCallback(
    (card: Card) => ({
      onChangeCardQuantity:
        canEdit || card.encounter_code || card.subtype_code
          ? onChangeCardQuantity
          : undefined,
      renderCardBefore:
        currentTool === "recommendations" ? renderCoreCardCheckbox : undefined,
      renderCardExtra:
        currentTab === "slots" || currentTab === "extraSlots"
          ? renderCardExtraSlots
          : currentTab === "sideSlots"
            ? renderMoveToMainDeck
            : undefined,
    }),
    [
      canEdit,
      onChangeCardQuantity,
      renderCardExtraSlots,
      renderMoveToMainDeck,
      currentTab,
      currentTool,
      renderCoreCardCheckbox,
    ],
  );

  return (
    <ListLayoutContextProvider>
      <ListLayout
        filters={
          <Filters>
            <DecklistValidation
              defaultOpen={validation.errors.length < 3}
              validation={validation}
            />
            <ShowUnusableCardsToggle />
          </Filters>
        }
        sidebar={
          <Editor
            currentTab={currentTab}
            currentTool={currentTool}
            getListCardProps={getListCardProps}
            onTabChange={setCurrentTab}
            tabs={tabs}
            validation={validation}
            viewMode={activeList?.display.viewMode}
          />
        }
        sidebarWidthMax="var(--sidebar-width-two-col)"
      >
        {(props) => (
          <Tabs
            onValueChange={setCurrentTool}
            className={css["tabs"]}
            value={currentTool}
          >
            <TabsList className={css["tabs-list"]} style={accentColor}>
              <TabsTrigger
                hotkey="c"
                onTabChange={setCurrentTool}
                tooltip="Card list"
                value="card-list"
              >
                <LayoutListIcon />
                <span>Card list</span>
              </TabsTrigger>
              <TabsTrigger
                hotkey="r"
                onTabChange={setCurrentTool}
                tooltip="Recommendations"
                value="recommendations"
              >
                <WandSparklesIcon />
                <span>Recommendations</span>
              </TabsTrigger>
              <TabsTrigger
                hotkey="n"
                onTabChange={setCurrentTool}
                tooltip="Notes"
                data-testid="editor-notes"
                value="notes"
              >
                <BookOpenTextIcon />
                <span>Notes</span>
              </TabsTrigger>
              <TabsTrigger
                hotkey="t"
                onTabChange={setCurrentTool}
                tooltip="Deck tools"
                value="deck-tools"
              >
                <ChartAreaIcon />
                <span>Tools</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="card-list" asChild>
              <CardListContainer
                {...props}
                getListCardProps={getListCardProps}
                quantities={deck[mapTabToSlot(currentTab)] ?? undefined}
                targetDeck={
                  mapTabToSlot(currentTab) === "extraSlots"
                    ? "extraSlots"
                    : "slots"
                }
              />
            </TabsContent>
            <TabsContent asChild value="notes">
              <NotesEditor deck={deck} />
            </TabsContent>
            <TabsContent asChild value="deck-tools">
              <DeckTools {...props} deck={deck} scrollable />
            </TabsContent>
            <TabsContent asChild value="recommendations">
              <CardRecommender
                {...props}
                getListCardProps={getListCardProps}
                quantities={deck[mapTabToSlot(currentTab)] ?? undefined}
                targetDeck={
                  mapTabToSlot(currentTab) === "extraSlots"
                    ? "extraSlots"
                    : "slots"
                }
              />
            </TabsContent>
          </Tabs>
        )}
      </ListLayout>
    </ListLayoutContextProvider>
  );
}

export default DeckEdit;
