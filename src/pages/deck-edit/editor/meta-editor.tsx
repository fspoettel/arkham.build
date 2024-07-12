import { useCallback } from "react";

import { Field, FieldLabel } from "@/components/ui/field";
import type { SelectOption } from "@/components/ui/select";
import { Select } from "@/components/ui/select";
import { useStore } from "@/store";
import type { DisplayDeck } from "@/store/lib/deck-grouping";
import type { CardWithRelations, ResolvedDeck } from "@/store/lib/types";
import { selectTabooSetSelectOptions } from "@/store/selectors/lists";
import type { DeckOptionSelectType } from "@/store/services/queries.types";
import type { StoreState } from "@/store/slices";
import { debounce } from "@/utils/debounce";
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
        {
          value: deck.cards.investigator.card.code,
          label: `Original ${type}`,
        },
        {
          value: deck.cards.investigator.relations?.parallel?.card
            .code as string,
          label: `Parallel ${type}`,
        },
      ]
    : [];
}

const selectUpdateName = (state: StoreState) => debounce(state.updateName, 100);

const selectUpdateDescription = (state: StoreState) =>
  debounce(state.updateDescription, 100);

const selectUpdateTags = (state: StoreState) => debounce(state.updateTags, 100);

const selectUpdateTabooId = (state: StoreState) => state.updateTabooId;

const selectUpdateMetaProperty = (state: StoreState) =>
  state.updateMetaProperty;

const selectUpdateInvestigatorSide = (state: StoreState) =>
  state.updateInvestigatorSide;

export function MetaEditor(props: Props) {
  const tabooSets = useStore(selectTabooSetSelectOptions);

  const updateName = useStore(selectUpdateName);
  const updateDescription = useStore(selectUpdateDescription);
  const updateTags = useStore(selectUpdateTags);
  const updateTabooId = useStore(selectUpdateTabooId);
  const updateMetaProperty = useStore(selectUpdateMetaProperty);
  const updateInvestigatorSide = useStore(selectUpdateInvestigatorSide);

  const onTabooChange = useCallback(
    (evt: React.ChangeEvent<HTMLSelectElement>) => {
      if (evt.target instanceof HTMLSelectElement) {
        const value = Number.parseInt(evt.target.value, 10);
        updateTabooId(props.deck.id, Number.isNaN(value) ? null : value);
      }
    },
    [updateTabooId, props.deck.id],
  );

  const onNameChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      if (evt.target instanceof HTMLInputElement) {
        updateName(props.deck.id, evt.target.value);
      }
    },
    [updateName, props.deck.id],
  );

  const onDescriptionChange = useCallback(
    (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (evt.target instanceof HTMLTextAreaElement) {
        updateDescription(props.deck.id, evt.target.value);
      }
    },
    [updateDescription, props.deck.id],
  );

  const onTagsChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      if (evt.target instanceof HTMLInputElement) {
        updateTags(props.deck.id, evt.target.value);
      }
    },
    [updateTags, props.deck.id],
  );

  const onFieldChange = useCallback(
    (evt: React.ChangeEvent<HTMLSelectElement>) => {
      if (evt.target instanceof HTMLSelectElement) {
        const value = evt.target.value;

        if (evt.target.dataset.field && evt.target.dataset.type) {
          updateMetaProperty(
            props.deck.id,
            evt.target.dataset.field,
            value || null,
            evt.target.dataset.type as DeckOptionSelectType,
          );
        }
      }
    },
    [updateMetaProperty, props.deck.id],
  );

  const onInvestigatorSideChange = useCallback(
    (evt: React.ChangeEvent<HTMLSelectElement>) => {
      if (evt.target instanceof HTMLSelectElement) {
        const value = evt.target.value;
        if (evt.target.dataset.side) {
          updateInvestigatorSide(props.deck.id, evt.target.dataset.side, value);
        }
      }
    },
    [updateInvestigatorSide, props.deck.id],
  );

  return (
    <>
      <Field full padded>
        <FieldLabel>Deck name</FieldLabel>
        <input
          defaultValue={props.deck.name}
          onChange={onNameChange}
          required
          type="text"
        />
      </Field>
      <Field full helpText="Enter tags, separated by spaces" padded>
        <FieldLabel>Tags</FieldLabel>
        <input
          defaultValue={props.deck.tags ?? ""}
          onChange={onTagsChange}
          type="text"
        />
      </Field>

      {props.deck.hasParallel && (
        <>
          <Field full padded>
            <FieldLabel>Investigator Front</FieldLabel>
            <Select
              data-side="front"
              onChange={onInvestigatorSideChange}
              options={getInvestigatorOptions(props.deck, "Front")}
              required
              value={props.deck.investigatorFront.card.code}
            />
          </Field>
          <Field full padded>
            <FieldLabel>Investigator Back</FieldLabel>
            <Select
              data-side="back"
              onChange={onInvestigatorSideChange}
              options={getInvestigatorOptions(props.deck, "Back")}
              required
              value={props.deck.investigatorBack.card.code}
            />
          </Field>
        </>
      )}
      {props.deck.selections &&
        Object.entries(props.deck.selections).map(([key, value]) => (
          <Field full key={key} padded>
            <FieldLabel>{formatSelectionId(key)}</FieldLabel>
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
      <Field full padded>
        <FieldLabel>Taboo Set</FieldLabel>
        <Select
          emptyLabel="None"
          onChange={onTabooChange}
          options={tabooSets}
          value={props.deck.taboo_id ?? ""}
        />
      </Field>
      <Field full padded>
        <FieldLabel>Description</FieldLabel>
        <textarea
          defaultValue={props.deck.description_md ?? ""}
          onChange={onDescriptionChange}
        />
      </Field>
    </>
  );
}
