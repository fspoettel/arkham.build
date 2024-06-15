import { Save } from "lucide-react";
import { useCallback } from "react";
import { useLocation } from "wouter";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/store";
import type { DisplayDeck } from "@/store/lib/deck-grouping";
import { useAccentColor } from "@/utils/use-accent-color";

import css from "./editor.module.css";

type Props = {
  deck: DisplayDeck;
};

export function EditorActions({ deck }: Props) {
  const [, navigate] = useLocation();
  const showToast = useToast();
  const cssVariables = useAccentColor(
    deck.cards.investigator.card.faction_code,
  );

  const saveDeck = useStore((state) => state.saveDeck);

  const dirty = useStore((state) =>
    state?.deckView?.mode === "edit" ? state.deckView.dirty : false,
  );

  const handleSave = useCallback(() => {
    const id = saveDeck();
    navigate(`/deck/view/${id}`);

    showToast({
      children: "Deck saved successfully.",
      variant: "success",
    });
  }, [saveDeck, navigate, showToast]);

  const handleCancel = useCallback(async () => {
    if (!deck?.id) return;

    const confirmed =
      !dirty ||
      confirm(
        "This operation will revert the changes made to the deck. Do you want to continue?",
      );
    if (confirmed) navigate(`/deck/view/${deck.id}`);
  }, [navigate, deck?.id, dirty]);

  return (
    <div className={css["actions"]} style={cssVariables}>
      <Button onClick={handleSave} variant="primary">
        <Save />
        Save
      </Button>
      <Button onClick={handleCancel} variant="bare">
        Cancel edits
      </Button>
    </div>
  );
}
