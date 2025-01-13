import { Field, FieldLabel } from "@/components/ui/field";
import { Scroller } from "@/components/ui/scroller";
import { useStore } from "@/store";
import type { ResolvedDeck } from "@/store/lib/types";
import type { StoreState } from "@/store/slices";
import { debounce } from "@/utils/debounce";
import { useCallback } from "react";
import { createSelector } from "reselect";
import css from "./notes-editor.module.css";

type Props = {
  deck: ResolvedDeck;
};

const selectUpdateDescription = createSelector(
  (state: StoreState) => state.updateDescription,
  (updateDescription) => debounce(updateDescription, 100),
);

const selectUpdateMetaProperty = createSelector(
  (state: StoreState) => state.updateMetaProperty,
  (updateMetaProperty) => debounce(updateMetaProperty, 100),
);

export function NotesEditor(props: Props) {
  const { deck } = props;

  const updateDescription = useStore(selectUpdateDescription);
  const updateMetaProperty = useStore(selectUpdateMetaProperty);

  const onDescriptionChange = useCallback(
    (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (evt.target instanceof HTMLTextAreaElement) {
        updateDescription(deck.id, evt.target.value);
      }
    },
    [updateDescription, deck.id],
  );

  const onBannerUrlChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      if (evt.target instanceof HTMLInputElement) {
        updateMetaProperty(deck.id, "banner_url", evt.target.value);
      }
    },
    [updateMetaProperty, deck.id],
  );

  const onIntroChange = useCallback(
    (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (evt.target instanceof HTMLTextAreaElement) {
        updateMetaProperty(deck.id, "intro_md", evt.target.value);
      }
    },
    [updateMetaProperty, deck.id],
  );

  return (
    <Scroller>
      <div className={css["notes-editor"]}>
        <Field full helpText="Supports ArkhamDB-flavoured markdown." padded>
          <FieldLabel>Notes</FieldLabel>
          <textarea
            data-testid="editor-description"
            defaultValue={deck.description_md ?? ""}
            onChange={onDescriptionChange}
            style={{ minHeight: "50dvh" }}
          />
        </Field>
        <Field
          full
          padded
          helpText="Banner image for the deck. Will be displayed on the deck view and in social media previews. Aspect ratio is 4:1, at least 1440px wide"
        >
          <FieldLabel>Banner URL</FieldLabel>
          <input
            defaultValue={deck.metaParsed.banner_url ?? ""}
            onChange={onBannerUrlChange}
            type="text"
            placeholder="Enter URL..."
          />
        </Field>
        <Field
          full
          padded
          helpText="A short deck introduction. Will be displayed on the deck view and in social media previews."
        >
          <FieldLabel>Intro</FieldLabel>
          <textarea
            data-testid="editor-intro"
            defaultValue={deck.metaParsed.intro_md ?? ""}
            onChange={onIntroChange}
          />
        </Field>
      </div>
    </Scroller>
  );
}
