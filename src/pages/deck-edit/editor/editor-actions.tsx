import { Save } from "lucide-react";
import { useCallback } from "react";
import { Link, useLocation } from "wouter";

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

  const handleSave = useCallback(() => {
    const id = saveDeck();
    navigate(`/deck/view/${id}`);

    showToast({
      children: "Deck saved successfully.",
      variant: "success",
    });
  }, [saveDeck, navigate, showToast]);

  return (
    <div className={css["actions"]} style={cssVariables}>
      <Button onClick={handleSave} variant="primary">
        <Save />
        Save
      </Button>
      <Link asChild href={`/deck/view/${deck.id}`}>
        <Button variant="bare">Cancel edits</Button>
      </Link>
    </div>
  );
}
