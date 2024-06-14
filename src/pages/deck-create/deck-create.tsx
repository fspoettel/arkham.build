import { useEffect } from "react";
import { useLocation, useParams } from "wouter";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/store";
import { useGoBack } from "@/utils/useBack";

import css from "./deck-create.module.css";

import { DeckCreateCardSets } from "./deck-create-card-sets";
import { DeckCreateEditor } from "./deck-create-editor";
import { DeckCreateInvestigator } from "./deck-create-investigator";
import { Layout } from "./layout";

function DeckCreate() {
  const goBack = useGoBack();
  const toast = useToast();
  const [, navigate] = useLocation();
  const { code } = useParams<{ code: string }>();
  const deckCreate = useStore((state) => state.deckCreate);

  const createDeck = useStore((state) => state.createDeck);
  const destroy = useStore((state) => state.resetCreate);
  const initialize = useStore((state) => state.initCreate);

  useEffect(() => {
    initialize(code);
    return () => {
      destroy();
    };
  }, [code, initialize, destroy]);

  const handleDeckCreate = () => {
    const id = createDeck();
    navigate(`/deck/edit/${id}`);
    toast({ children: "Deck created successfully.", variant: "success" });
  };

  if (!deckCreate) return null;

  return (
    <Layout
      mastheadContent={
        <nav className={css["editor-nav"]}>
          <Button onClick={handleDeckCreate}>Create deck</Button>
          <Button onClick={goBack} type="button" variant="bare">
            Cancel
          </Button>
        </nav>
      }
      selections={<DeckCreateCardSets />}
      sidebar={<DeckCreateEditor />}
    >
      <DeckCreateInvestigator />
    </Layout>
  );
}

export default DeckCreate;
