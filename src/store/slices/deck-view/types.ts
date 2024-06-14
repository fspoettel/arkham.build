import type { DeckOptionSelectType } from "@/store/services/types";

export type Slot = "slots" | "sideSlots" | "extraSlots";

export type Tab = Slot | "meta";

export function isSlot(value: string): value is Slot {
  return value === "slots" || value === "sideSlots" || value === "extraSlots";
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
    default:
      return "slots";
  }
}

type SlotEdit = {
  code: string;
  quantity: number;
};

export type CustomizationEdit = {
  xp_spent?: number;
  selections?: string[];
};

export type EditState = {
  edits: {
    quantities: {
      slots?: SlotEdit[];
      sideSlots?: SlotEdit[];
      extraSlots?: SlotEdit[];
    };
    meta: Record<string, string | null>;
    tabooId?: number | null;
    investigatorFront?: string | null;
    investigatorBack?: string | null;
    customizations: {
      [code: string]: {
        [id: number]: CustomizationEdit;
      };
    };
  };
  mode: "edit";
  activeTab: Tab;
};

export type ViewState = {
  mode: "view";
};

export type DeckViewState = {
  id: string;
} & (EditState | ViewState);

export type DeckViewSlice = {
  deckView: DeckViewState | null;

  setActiveDeck(id?: string, type?: "view" | "edit"): void;

  changeCardQuantity(code: string, quantity: number, slot?: Slot): void;

  updateActiveTab(value: string): void;

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
};
