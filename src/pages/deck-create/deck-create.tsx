import { useEffect } from "react";
import { useParams } from "wouter";

import { useStore } from "@/store";
import { useDocumentTitle } from "@/utils/use-document-title";

import { DeckCreateInner } from "./deck-create-inner";

function DeckCreate() {
  const { code } = useParams<{ code: string }>();
  const deckCreate = useStore((state) => state.deckCreate);

  const destroy = useStore((state) => state.resetCreate);
  const initialize = useStore((state) => state.initCreate);

  useDocumentTitle("Create deck");

  useEffect(() => {
    initialize(code);
    return () => {
      destroy();
    };
  }, [code, initialize, destroy]);

  return deckCreate ? <DeckCreateInner /> : null;
}

export default DeckCreate;
