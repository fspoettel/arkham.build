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

  const hasEdits = useStore((state) => !!state.deckEdits[deck.id]);
  const discardEdits = useStore((state) => state.discardEdits);
  const saveDeck = useStore((state) => state.saveDeck);

  const handleSave = useCallback(() => {
    const id = saveDeck(deck.id);
    navigate(`/deck/view/${id}`);

    showToast({
      children: "Deck saved successfully.",
      displayTime: 3000,
      variant: "success",
    });
  }, [saveDeck, navigate, showToast, deck.id]);

  const handleDiscard = useCallback(() => {
    const confirmed =
      !hasEdits ||
      window.confirm("Are you sure you want to discard your changes?");
    if (confirmed) {
      discardEdits(deck.id);
      navigate(`/deck/view/${deck.id}`);
    }
  }, [discardEdits, navigate, deck.id, hasEdits]);

  return (
    <div className={css["actions"]} style={cssVariables}>
      <Button onClick={handleSave} variant="primary">
        <Save />
        Save
      </Button>
      <Button onClick={handleDiscard} variant="bare">
        Discard edits
      </Button>
    </div>
  );
}
