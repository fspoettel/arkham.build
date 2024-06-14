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
      extraSlots?: SlotEdit[];
      ignoreDeckLimitSlots?: SlotEdit[];
      sideSlots?: SlotEdit[];
      slots?: SlotEdit[];
    };
    name?: string | null;
    description_md?: string | null;
    tags?: string | null;
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

  updateName(value: string): void;

  updateDescription(value: string): void;

  updateTags(value: string): void;
};
