import { useEffect } from "react";
import { useParams } from "wouter";

import { useStore } from "@/store";

import { DeckCreateCardSets } from "./deck-create-card-sets";
import { DeckCreateEditor } from "./deck-create-editor";
import { DeckCreateInvestigator } from "./deck-create-investigator";
import { Layout } from "./layout";

function DeckCreate() {
  const { code } = useParams<{ code: string }>();
  const deckCreate = useStore((state) => state.deckCreate);

  const destroy = useStore((state) => state.resetCreate);
  const initialize = useStore((state) => state.initCreate);

  useEffect(() => {
    initialize(code);
    return () => {
      destroy();
    };
  }, [code, initialize, destroy]);

  if (!deckCreate) return null;

  return (
    <Layout selections={<DeckCreateCardSets />} sidebar={<DeckCreateEditor />}>
      <DeckCreateInvestigator />
    </Layout>
  );
}

export default DeckCreate;
