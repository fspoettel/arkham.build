import type { DeckOptionSelectType } from "@/store/services/queries.types";

import type { Id } from "./data.types";

export type Slot =
  | "slots"
  | "sideSlots"
  | "extraSlots"
  | "ignoreDeckLimitSlots";

export type Tab = Slot | "meta";

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

export type EditsState = {
  [id: Id]: EditState;
};

export type DeckEditsSlice = {
  deckEdits: EditsState;

  discardEdits(deckId: Id): void;

  updateCardQuantity(
    deckId: Id,
    code: string,
    quantity: number,
    slot?: Slot,
    mode?: "increment" | "set",
  ): void;

  updateTabooId(deckId: Id, value: number | null): void;

  updateInvestigatorSide(deckId: Id, side: string, code: string): void;

  updateCustomization(
    deckId: Id,
    code: string,
    index: number,
    edit: CustomizationEdit,
  ): void;

  updateMetaProperty(
    deckId: Id,
    key: string,
    value: string | null,
    type: DeckOptionSelectType,
  ): void;

  updateName(deckId: Id, value: string): void;

  updateDescription(deckId: Id, value: string): void;

  updateTags(deckId: Id, value: string): void;
};
