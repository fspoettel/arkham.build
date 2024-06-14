import { UploadIcon } from "@radix-ui/react-icons";
import { useCallback } from "react";

import { useStore } from "@/store";

import css from "./deck-collection.module.css";

import { Button } from "../ui/button";

export function DeckCollectionImport() {
  const importDecks = useStore((state) => state.importDecks);

  const onAddFiles = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      const files = evt.target.files;
      if (files?.length) importDecks(files);
    },
    [importDecks],
  );

  return (
    <div className={css["deck-collection-import"]}>
      <Button as="label" htmlFor="deck-collection-import">
        <UploadIcon />
      </Button>
      <input
        accept="application/json"
        className={css["deck-collection-import-input"]}
        id="deck-collection-import"
        multiple
        onChange={onAddFiles}
        type="file"
      />
    </div>
  );
}
