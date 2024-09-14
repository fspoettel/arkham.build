import { useEffect } from "react";
import { useParams, useSearch } from "wouter";

import { CardModalProvider } from "@/components/card-modal/card-modal-context";
import { useStore } from "@/store";
import { useDocumentTitle } from "@/utils/use-document-title";

import { DeckCreateInner } from "./deck-create-inner";

function DeckCreate() {
  const { code } = useParams<{ code: string }>();
  const search = useSearch();
  const deckCreate = useStore((state) => state.deckCreate);

  const destroy = useStore((state) => state.resetCreate);
  const initialize = useStore((state) => state.initCreate);

  useDocumentTitle("Create deck");

  useEffect(() => {
    const initialInvestigatorChoice = new URLSearchParams(search)
      .get("initial_investigator")
      ?.toString();

    initialize(code, initialInvestigatorChoice);

    return () => {
      destroy();
    };
  }, [code, destroy, initialize, search]);

  return deckCreate ? (
    <CardModalProvider>
      <DeckCreateInner />
    </CardModalProvider>
  ) : null;
}

export default DeckCreate;
