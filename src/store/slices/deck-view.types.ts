import type { DeckOptionSelectType } from "@/store/services/queries.types";

export type Slot =
  | "slots"
  | "sideSlots"
  | "extraSlots"
  | "ignoreDeckLimitSlots";

export type Tab = Slot | "meta";

export function isSlot(value: string): value is Slot {
  return (
    value === "slots" ||
    value === "sideSlots" ||
    value === "extraSlots" ||
    value === "ignoreDeckLimitSlots"
  );
}

export function isTab(value: string): value is Tab {
  return isSlot(value) || value === "meta";
}

export function mapTabToSlot(tab: Tab): Slot {
  switch (tab) {
    case "extraSlots":
      return "extraSlots";
    case "sideSlots":
      return "sideSlots";
    case "ignoreDeckLimitSlots":
      return "ignoreDeckLimitSlots";
    default:
      return "slots";
  }
}

export type CustomizationEdit = {
  xp_spent?: number;
  selections?: string[];
};

export type EditState = {
  edits: {
    customizations: {
      [code: string]: {
        [id: number]: CustomizationEdit;
      };
    };
    meta: {
      [key: string]: string | null;
    };
    quantities: {
      extraSlots?: Record<string, number>;
      ignoreDeckLimitSlots?: Record<string, number>;
      sideSlots?: Record<string, number>;
      slots?: Record<string, number>;
    };
    name?: string | null;
    description_md?: string | null;
    tags?: string | null;
    tabooId?: number | null;
    investigatorFront?: string | null;
    investigatorBack?: string | null;
  };
  dirty: boolean;
  activeTab: Tab;
  showUnusableCards: boolean;
};

export type DeckViewState = {
  id: string;
} & EditState;

export type DeckViewSlice = {
  deckView: DeckViewState | null;

  setActiveDeck(id?: string): void;

  updateActiveTab(value: string): void;

  updateCardQuantity(
    code: string,
    quantity: number,
    slot?: Slot,
    mode?: "increment" | "set",
  ): void;

  updateTabooId(value: number | null): void;

  updateInvestigatorSide(side: string, code: string): void;

  updateCustomization(
    code: string,
    index: number,
    edit: CustomizationEdit,
  ): void;

  updateMetaProperty(
    key: string,
    value: string | null,
    type: DeckOptionSelectType,
  ): void;

  updateName(value: string): void;

  updateDescription(value: string): void;

  updateTags(value: string): void;

  updateShowUnusableCards(value: boolean): void;
};
