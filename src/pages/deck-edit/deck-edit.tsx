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
  LayoutListIcon,
  UndoIcon,
  WandSparklesIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
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

  const { t } = useTranslation();
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
              {t("deck_edit.changes_restored")}
              <div className={css["restore"]}>
                <Button onClick={onClose} size="sm">
                  {t("common.ok")}
                </Button>
                <Button
                  onClick={() => {
                    discardEdits(id);
                    onClose();
                  }}
                  size="sm"
                >
                  <UndoIcon />
                  {t("common.undo")}
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
  const { t } = useTranslation();

  useDocumentTitle(t("deck_edit.title", { name: deck.name }));

  const [currentTab, setCurrentTab] = useState<Tab>("slots");
  const [currentTool, setCurrentTool] = useState<string>("card-list");

  const tabs = useMemo(() => {
    const tabs = [
      {
        label: t("common.decks.slots"),
        value: "slots",
        type: "deck",
        hotkey: "d",
        hotkeyLabel: t("deck_edit.actions.cycle_decks"),
      },
      {
        label: t("common.decks.sideSlots_short"),
        value: "sideSlots",
        type: "deck",
        hotkey: "d",
        hotkeyLabel: t("deck_edit.actions.cycle_decks"),
      },
    ];

    if (deck.hasExtraDeck) {
      tabs.push({
        label: t("common.decks.extraSlots_short"),
        value: "extraSlots",
        type: "deck",
        hotkey: "d",
        hotkeyLabel: t("deck_edit.actions.cycle_decks"),
      });
    }

    tabs.push({
      label: t("deck_edit.tab_config"),
      value: "config",
      type: "app",
      hotkey: "c",
      hotkeyLabel: t("deck_edit.tab_config"),
    });

    return tabs;
  }, [deck.hasExtraDeck, t]);

  const updateCardQuantity = useStore((state) => state.updateCardQuantity);
  const validation = useStore((state) => selectDeckValid(state, deck));

  const accentColor = useAccentColor(deck.investigatorBack.card.faction_code);

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
    setCurrentTab("config");
  }, []);

  useHotkey("d", onCycleDeck);
  useHotkey("c", onSetMeta);

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

      if (isEmpty(getMatchingAttachables(card, deck))) {
        return null;
      }

      return <Attachments card={card} resolvedDeck={deck} />;
    },
    [deck, currentTab],
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
        currentTab === "slots"
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
                hotkey="l"
                onTabChange={setCurrentTool}
                tooltip={t("deck_edit.tab_card_list")}
                value="card-list"
              >
                <LayoutListIcon />
                <span>{t("deck_edit.tab_card_list")}</span>
              </TabsTrigger>
              <TabsTrigger
                hotkey="r"
                onTabChange={setCurrentTool}
                tooltip={t("deck_edit.tab_recommendations")}
                value="recommendations"
              >
                <WandSparklesIcon />
                <span>{t("deck_edit.tab_recommendations")}</span>
              </TabsTrigger>
              <TabsTrigger
                hotkey="n"
                onTabChange={setCurrentTool}
                tooltip={t("deck_edit.tab_notes")}
                data-testid="editor-notes"
                value="notes"
              >
                <BookOpenTextIcon />
                <span>{t("deck_edit.tab_notes")}</span>
              </TabsTrigger>
              <TabsTrigger
                hotkey="t"
                onTabChange={setCurrentTool}
                tooltip={t("deck_edit.tab_tools")}
                value="deck-tools"
              >
                <ChartAreaIcon />
                <span>{t("deck_edit.tab_tools")}</span>
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
