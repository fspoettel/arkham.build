import type { Card } from "../services/queries.types";
import type { Id } from "./data.types";
import type { InsertCardFormatValue } from "./notes-editor-card-to-markdown";

export type TemplateStringPlaceholders = "class" | "name" | "code" | "set";

export type SpacingOnDisplay = "left" | "right" | "both" | false;
type DisambiguateDisplay = "disambiguate";
export type InsertType = "card" | "symbol";

export interface InsertCardFormat {
  templateString: string;

  placeholderOptions: {
    class: {
      spacingOnDisplay: SpacingOnDisplay;
    };
    name: {
      classColored: boolean;
      subname: {
        display: boolean | DisambiguateDisplay;
        small: boolean;
        parentheses: boolean;
        spacingOnDisplay: SpacingOnDisplay;
      };
      level: {
        display: boolean | DisambiguateDisplay;
        type: "dots" | "number-parentheses" | "number-parenteses-with-zero";
        spacingOnDisplay: SpacingOnDisplay;
      };
    };
    set: {
      small: boolean;
      parentheses: boolean;
      collectorsNumber: boolean;
      spacingOnDisplay: SpacingOnDisplay;
    };
  };
}

interface NotesEditorState {
  insertType: InsertType;
  insertCardFormat: InsertCardFormatValue;
  insertPositionStart: number | undefined;
  insertPositionEnd: number | undefined;
}

interface NotesEditorFunctions {
  setInsertType: (insertType: InsertType) => void;
  setInsertPosition(start: number, end: number): void;
  resetInsertPosition: () => void;
  setInsertCardFormat: (value: InsertCardFormatValue) => void;
  insertCard(deckId: Id, card: Card): InsertResult;
  insertString(deckId: Id, string: string): InsertResult;
}

interface InsertResult {
  newCaretPosition: number | undefined;
}

export interface NotesEditorSlice {
  notesEditorState: NotesEditorState;
  notesEditorFunctions: NotesEditorFunctions;
}
