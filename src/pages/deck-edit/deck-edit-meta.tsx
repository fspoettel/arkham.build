import type { ChangeEvent } from "react";

import { Field } from "@/components/ui/field";
import type { SelectOption } from "@/components/ui/select";
import { Select } from "@/components/ui/select";
import { useStore } from "@/store";
import type { DisplayDeck } from "@/store/lib/deck-grouping";
import type { CardWithRelations, ResolvedDeck } from "@/store/lib/types";
import { selectTabooSetSelectOptions } from "@/store/selectors/filters";
import type { DeckOptionSelectType } from "@/store/services/types";
import { capitalize, formatSelectionId } from "@/utils/formatting";

type Props = {
  deck: DisplayDeck;
};

function getInvestigatorOptions(
  deck: ResolvedDeck<CardWithRelations>,
  type: "Front" | "Back",
): SelectOption[] {
  return deck.hasParallel
    ? [
        { value: deck.cards.investigator.card.code, label: `Original ${type}` },
        {
          value: deck.cards.investigator.relations?.parallel?.card
            .code as string,
          label: `Parallel ${type}`,
        },
      ]
    : [];
}

export function DeckEditMeta({ deck }: Props) {
  const tabooSets = useStore(selectTabooSetSelectOptions);

  const updateName = useStore((state) => state.updateName);
  const updateDescription = useStore((state) => state.updateDescription);

  const updateTabooId = useStore((state) => state.updateTabooId);
  const updateMetaProperty = useStore((state) => state.updateMetaProperty);
  const updateInvestigatorSide = useStore(
    (state) => state.updateInvestigatorSide,
  );

  const onTabooChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    const value = Number.parseInt(evt.target.value, 10);
    updateTabooId(Number.isNaN(value) ? null : value);
  };

  const onNameChange = (evt: ChangeEvent<HTMLInputElement>) => {
    updateName(evt.target.value);
  };

  const onDescriptionChange = (evt: ChangeEvent<HTMLTextAreaElement>) => {
    updateDescription(evt.target.value);
  };

  const onFieldChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    const value = evt.target.value;

    if (evt.target.dataset.field && evt.target.dataset.type) {
      updateMetaProperty(
        evt.target.dataset.field,
        value || null,
        evt.target.dataset.type as DeckOptionSelectType,
      );
    }
  };

  const onInvestigatorSideChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    const value = evt.target.value;
    if (evt.target.dataset.side) {
      updateInvestigatorSide(evt.target.dataset.side, value);
    }
  };

  return (
    <>
      {deck.hasParallel && (
        <>
          <Field full>
            <label>Deck name</label>
            <input
              onChange={onNameChange}
              required
              type="text"
              value={deck.name}
            />
          </Field>
          <Field full>
            <label>Investigator Front</label>
            <Select
              data-side="front"
              onChange={onInvestigatorSideChange}
              options={getInvestigatorOptions(deck, "Front")}
              required
              value={deck.investigatorFront.card.code}
            />
          </Field>
          <Field full>
            <label>Investigator Back</label>
            <Select
              data-side="back"
              onChange={onInvestigatorSideChange}
              options={getInvestigatorOptions(deck, "Back")}
              required
              value={deck.investigatorBack.card.code}
            />
          </Field>
        </>
      )}
      {deck.selections &&
        Object.entries(deck.selections).map(([key, value]) => (
          <Field full key={key}>
            <label>{formatSelectionId(key)}</label>
            {(value.type === "deckSize" || value.type === "faction") && (
              <Select
                data-field={value.accessor}
                data-type={value.type}
                emptyLabel="None"
                onChange={onFieldChange}
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
                data-type={value.type}
                emptyLabel="None"
                onChange={onFieldChange}
                options={value.options.map((v) => ({
                  value: v.id,
                  label: v.name,
                }))}
                value={value.value?.id ?? ""}
              />
            )}
          </Field>
        ))}
      <Field full>
        <label>Taboo Set</label>
        <Select
          emptyLabel="None"
          onChange={onTabooChange}
          options={tabooSets}
          value={deck.taboo_id ?? ""}
        />
      </Field>
      <Field full>
        <label>Description</label>
        <textarea
          onChange={onDescriptionChange}
          value={deck.description_md ?? ""}
        />
      </Field>
    </>
  );
}
