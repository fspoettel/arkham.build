export type Slot = "slots" | "sideSlots" | "extraSlots";

export type Tab = Slot | "meta";

type SlotEdit = {
  code: string;
  quantity: number;
};

type EditState = {
  edits: {
    slots?: SlotEdit[];
    sideSlots?: SlotEdit[];
    extraSlots?: SlotEdit[];
  };
  mode: "edit";
  activeTab: Tab;
};

type ViewState = {
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
};
