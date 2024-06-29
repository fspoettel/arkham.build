import { useCallback } from "react";
import { useLocation } from "wouter";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import type { SelectOption } from "@/components/ui/select";
import { Select } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";
import { useStore } from "@/store";
import { decodeSelections } from "@/store/lib/serialization/deck-meta";
import type { CardWithRelations } from "@/store/lib/types";
import {
  selectDeckCreateChecked,
  selectDeckCreateInvestigator,
  selectDeckCreateInvestigatorBack,
} from "@/store/selectors/deck-create";
import { selectTabooSetSelectOptions } from "@/store/selectors/lists";
import { capitalize, formatSelectionId } from "@/utils/formatting";
import { useGoBack } from "@/utils/use-go-back";

import css from "./deck-create.module.css";

import { useAccentColor } from "../../utils/use-accent-color";

export function DeckCreateEditor() {
  const deckCreate = useStore(selectDeckCreateChecked);
  const investigator = useStore(selectDeckCreateInvestigator);
  const back = useStore(selectDeckCreateInvestigatorBack);

  const createDeck = useStore((state) => state.createDeck);

  const toast = useToast();
  const [, navigate] = useLocation();

  const goBack = useGoBack();

  const handleDeckCreate = () => {
    const id = createDeck();
    navigate(`/deck/edit/${id}`, { replace: true });
    toast({
      children: "Deck created successfully.",
      duration: 2000,
      variant: "success",
    });
  };

  const tabooSets = useStore(selectTabooSetSelectOptions);

  const setTitle = useStore((state) => state.deckCreateSetTitle);
  const setTabooSet = useStore((state) => state.deckCreateSetTabooSet);
  const setSelection = useStore((state) => state.deckCreateSetSelection);
  const setInvestigatorCode = useStore(
    (state) => state.deckCreateSetInvestigatorCode,
  );

  const handleInputChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      if (evt.target instanceof HTMLInputElement) {
        setTitle(evt.target.value);
      }
    },
    [setTitle],
  );

  const handleTabooSetChange = useCallback(
    (evt: React.ChangeEvent<HTMLSelectElement>) => {
      if (evt.target instanceof HTMLSelectElement) {
        const value = evt.target.value;
        setTabooSet(value ? Number.parseInt(value, 10) : undefined);
      }
    },
    [setTabooSet],
  );

  const handleInvestigatorChange = useCallback(
    (evt: React.ChangeEvent<HTMLSelectElement>) => {
      if (evt.target instanceof HTMLSelectElement) {
        const side = evt.target.getAttribute("data-side") as "front" | "back";
        const value = evt.target.value;
        setInvestigatorCode(side, value);
      }
    },
    [setInvestigatorCode],
  );

  const handleSelectionChange = useCallback(
    (evt: React.ChangeEvent<HTMLSelectElement>) => {
      if (evt.target instanceof HTMLSelectElement) {
        const key = evt.target.dataset.field;
        const value = evt.target.value;
        if (key) setSelection(key, value);
      }
    },
    [setSelection],
  );

  const selections = decodeSelections(back, deckCreate.selections);
  const cssVariables = useAccentColor(investigator.card.faction_code);

  return (
    <div className={css["editor"]} style={cssVariables}>
      <Field full padded>
        <FieldLabel>Title</FieldLabel>
        <input
          data-testid="create-title"
          onChange={handleInputChange}
          type="text"
          value={deckCreate.title}
        />
      </Field>

      <Field full padded>
        <FieldLabel>Taboo Set</FieldLabel>
        <Select
          data-testid="create-taboo"
          emptyLabel="None"
          onChange={handleTabooSetChange}
          options={tabooSets}
          value={deckCreate.tabooSetId ?? ""}
        />
      </Field>

      {investigator.relations?.parallel && (
        <>
          <Field full padded>
            <FieldLabel>Investigator Front</FieldLabel>
            <Select
              data-side="front"
              data-testid="create-investigator-front"
              onChange={handleInvestigatorChange}
              options={getInvestigatorOptions(investigator, "Front")}
              required
              value={deckCreate.investigatorFrontCode}
            />
          </Field>
          <Field full padded>
            <FieldLabel>Investigator Back</FieldLabel>
            <Select
              data-side="back"
              data-testid="create-investigator-back"
              onChange={handleInvestigatorChange}
              options={getInvestigatorOptions(investigator, "Back")}
              required
              value={deckCreate.investigatorBackCode}
            />
          </Field>
        </>
      )}

      {selections &&
        Object.entries(selections).map(([key, value]) => (
          <Field full key={key} padded>
            <FieldLabel>{formatSelectionId(key)}</FieldLabel>
            {(value.type === "deckSize" || value.type === "faction") && (
              <Select
                data-testid={`create-select-${key}`}
                data-field={value.accessor}
                data-type={value.type}
                emptyLabel="None"
                onChange={handleSelectionChange}
                options={value.options.map((v) => ({
                  value: v,
                  label: capitalize(v),
                }))}
                value={value.value ?? ""}
              />
            )}
            {value.type === "option" && (
              <Select
                data-field={value.accessor}
                data-testid={`create-select-${key}`}
                data-type={value.type}
                emptyLabel="None"
                onChange={handleSelectionChange}
                options={value.options.map((v) => ({
                  value: v.id,
                  label: v.name,
                }))}
                value={value.value?.id ?? ""}
              />
            )}
          </Field>
        ))}

      <nav className={css["editor-nav"]}>
        <Button
          data-testid="create-save"
          onClick={handleDeckCreate}
          variant="primary"
        >
          Create deck
        </Button>
        <Button onClick={goBack} type="button" variant="bare">
          Cancel
        </Button>
      </nav>
    </div>
  );
}

function getInvestigatorOptions(
  investigator: CardWithRelations,
  type: "Front" | "Back",
): SelectOption[] {
  return [
    { value: investigator.card.code, label: `Original ${type}` },
    {
      value: investigator.relations?.parallel?.card.code as string,
      label: `Parallel ${type}`,
    },
  ];
}
