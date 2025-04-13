import { displayAttribute } from "@/utils/card-utils";
import {
  CYCLES_WITH_STANDALONE_PACKS,
  type FactionName,
} from "@/utils/constants";
import { displayPackName } from "@/utils/formatting";
import type { Card, Cycle, Pack } from "../services/queries.types";
import type { LookupTables } from "./lookup-tables.types";
import type { Metadata } from "./metadata.types";
import type {
  InsertCardFormat,
  SpacingOnDisplay,
  TemplateStringPlaceholders,
} from "./notes-editor.types";

const paragraph: InsertCardFormat = {
  templateString: "[{name}](/card/{code})",
  placeholderOptions: {
    class: {
      spacingOnDisplay: "right",
    },
    name: {
      classColored: false,
      subname: {
        display: "disambiguate",
        small: true,
        parentheses: true,
        spacingOnDisplay: "left",
      },
      level: {
        display: "disambiguate",
        type: "number-parentheses",
        spacingOnDisplay: "left",
      },
    },
    set: {
      small: true,
      parentheses: true,
      collectorsNumber: false,
      spacingOnDisplay: "left",
    },
  },
};

const paragraphColored: InsertCardFormat = {
  templateString: "[{name}](/card/{code})",
  placeholderOptions: {
    class: {
      spacingOnDisplay: "right",
    },
    name: {
      classColored: true,
      subname: {
        display: "disambiguate",
        small: true,
        parentheses: true,
        spacingOnDisplay: "left",
      },
      level: {
        display: "disambiguate",
        type: "number-parentheses",
        spacingOnDisplay: "left",
      },
    },
    set: {
      small: true,
      parentheses: true,
      collectorsNumber: false,
      spacingOnDisplay: "left",
    },
  },
};

const header: InsertCardFormat = {
  templateString: "{class}[**{name}**](/card/{code})",
  placeholderOptions: {
    class: {
      spacingOnDisplay: "right",
    },
    name: {
      classColored: true,
      subname: {
        display: "disambiguate",
        small: true,
        parentheses: true,
        spacingOnDisplay: "left",
      },
      level: {
        display: true,
        type: "dots",
        spacingOnDisplay: "left",
      },
    },
    set: {
      small: true,
      parentheses: true,
      collectorsNumber: false,
      spacingOnDisplay: "left",
    },
  },
};

const headerWithSet: InsertCardFormat = {
  templateString: "{class}[**{name}**](/card/{code}){set}",
  placeholderOptions: {
    class: {
      spacingOnDisplay: "right",
    },
    name: {
      classColored: true,
      subname: {
        display: "disambiguate",
        small: true,
        parentheses: true,
        spacingOnDisplay: "left",
      },
      level: {
        display: true,
        type: "dots",
        spacingOnDisplay: "left",
      },
    },
    set: {
      small: true,
      parentheses: true,
      collectorsNumber: true,
      spacingOnDisplay: "left",
    },
  },
};

export type InsertCardFormatValue =
  | "paragraph"
  | "paragraphColored"
  | "header"
  | "headerWithSet";

export function insertCardFormatValueToInsertCardFormat(
  value: InsertCardFormatValue,
): InsertCardFormat {
  switch (value) {
    case "paragraph":
      return paragraph;
    case "paragraphColored":
      return paragraphColored;
    case "header":
      return header;
    case "headerWithSet":
      return headerWithSet;
  }
}

function replacePlaceholderIfFound(
  str: string,
  placeholder: TemplateStringPlaceholders,
  replaceWith: string,
): string {
  if (str.indexOf(`{${placeholder}}`) === -1) {
    return str;
  }
  return str.replaceAll(`{${placeholder}}`, replaceWith);
}

function addSpacing(str: string, spacingOnDisplay: SpacingOnDisplay): string {
  switch (spacingOnDisplay) {
    case "left":
      return ` ${str}`;
    case "right":
      return `${str} `;
    case "both":
      return ` ${str} `;
    default:
      return str;
  }
}

function surroundHtmlTag(
  str: string,
  tag: string,
  attributes?: { [k: string]: string },
): string {
  if (!attributes) {
    return `<${tag}>${str}</${tag}>`;
  }
  const attributeString = Object.entries(attributes)
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");
  return `<${tag} ${attributeString}>${str}</${tag}>`;
}

function surroundParentheses(str: string): string {
  return `(${str})`;
}

function cardToClassIcons(card: Card): string {
  function factionNameToIcon(faction: FactionName | undefined): string {
    switch (faction) {
      case "guardian":
        return '<span class="icon-guardian"></span>';
      case "seeker":
        return '<span class="icon-seeker"></span>';
      case "rogue":
        return '<span class="icon-rogue"></span>';
      case "mystic":
        return '<span class="icon-mystic"></span>';
      case "survivor":
        return '<span class="icon-survivor"></span>';
      default:
        return "";
    }
  }
  const class1: FactionName = card.faction_code as FactionName;
  const class2: FactionName | undefined = card.faction2_code as FactionName;
  const class3: FactionName | undefined = card.faction3_code as FactionName;
  return `${factionNameToIcon(class1)}${factionNameToIcon(
    class2,
  )}${factionNameToIcon(class3)}`;
}

function cardToColorClass(card: Card): string {
  const class1: FactionName = card.faction_code as FactionName;
  const class2: FactionName | undefined = card.faction2_code as FactionName;
  const class3: FactionName | undefined = card.faction3_code as FactionName;
  if (class2 === undefined && class3 === undefined) {
    switch (class1) {
      case "guardian":
        return "fg-guardian";
      case "seeker":
        return "fg-seeker";
      case "rogue":
        return "fg-rogue";
      case "mystic":
        return "fg-mystic";
      case "survivor":
        return "fg-survivor";
      case "neutral":
        return "fg-neutral";
      default:
        return "";
    }
  }
  return "fg-dual";
}

function surroundWithColorClass(str: string, card: Card): string {
  if ((card.faction_code as FactionName) === "mythos") {
    return str;
  }
  const colorClass = cardToColorClass(card);
  return surroundHtmlTag(str, "span", { class: colorClass });
}

export function cardToMarkdown(
  card: Card,
  lookupTables: LookupTables,
  metadata: Metadata,
  format: InsertCardFormat,
) {
  let s = format.templateString;
  const placeholderOptions = format.placeholderOptions;
  const name = displayAttribute(card, "name");
  const subname = displayAttribute(card, "subname");

  let classIconString = cardToClassIcons(card);
  if (
    classIconString.length > 0 &&
    placeholderOptions.class.spacingOnDisplay !== false
  ) {
    classIconString = addSpacing(
      classIconString,
      placeholderOptions.class.spacingOnDisplay,
    );
  }
  s = replacePlaceholderIfFound(s, "class", classIconString);

  const level = card.xp ?? 0;
  let nameSubnameLevelString = name;

  if (subname !== "") {
    let subnameString: string;
    switch (placeholderOptions.name.subname.display) {
      case false: {
        subnameString = "";
        break;
      }
      case true: {
        subnameString = subname;
        break;
      }
      case "disambiguate": {
        let shouldShowDisambiguateSubname = false;
        const levelToFirstFoundSubnameMap = new Map<number, string>();
        levelToFirstFoundSubnameMap.set(level, subname);
        const otherLevels = lookupTables.relations.level[card.code];
        if (otherLevels) {
          for (const otherLevel of Object.keys(otherLevels)) {
            const otherCard = metadata.cards[otherLevel];
            if (otherCard) {
              if (levelToFirstFoundSubnameMap.has(otherCard.xp ?? 0)) {
                shouldShowDisambiguateSubname = true;
              } else {
                levelToFirstFoundSubnameMap.set(
                  otherCard.xp ?? 0,
                  displayAttribute(otherCard, "subname"),
                );
              }
            }
          }
        }
        if (shouldShowDisambiguateSubname) {
          subnameString = subname;
        } else {
          subnameString = "";
        }
      }
    }
    if (subnameString.length > 0) {
      if (placeholderOptions.name.subname.parentheses) {
        subnameString = surroundParentheses(subnameString);
      }
      if (placeholderOptions.name.subname.small) {
        subnameString = surroundHtmlTag(subnameString, "span", {
          class: "small",
        });
      }
      subnameString = addSpacing(
        subnameString,
        placeholderOptions.name.subname.spacingOnDisplay,
      );
    }
    nameSubnameLevelString += subnameString;
  }

  if (placeholderOptions.name.level.display !== false) {
    let skipShowingLevel = false;
    if (placeholderOptions.name.level.display === "disambiguate") {
      const otherLevels = lookupTables.relations.level[card.code];
      if (otherLevels === undefined) {
        skipShowingLevel = true;
      }
    }
    let levelString = "";
    if (!skipShowingLevel) {
      switch (placeholderOptions.name.level.type) {
        case "dots": {
          if (level > 0) {
            levelString = surroundHtmlTag("•".repeat(level), "span", {
              class: "card-xp",
            });
          }
          break;
        }
        case "number-parentheses": {
          if (level > 0) {
            levelString = surroundParentheses(level.toString());
          }
          break;
        }
        case "number-parenteses-with-zero": {
          levelString = surroundParentheses(level.toString());
          break;
        }
      }
    }
    if (levelString.length > 0) {
      levelString = addSpacing(
        levelString,
        placeholderOptions.name.level.spacingOnDisplay,
      );
    }
    nameSubnameLevelString += levelString;
  }

  if (placeholderOptions.name.classColored) {
    nameSubnameLevelString = surroundWithColorClass(
      nameSubnameLevelString,
      card,
    );
  }

  const pack = metadata.packs[card.pack_code];
  const cycle = metadata.cycles[pack.cycle_code];
  function cycleOrPack(cycle: Cycle, pack: Pack) {
    if (CYCLES_WITH_STANDALONE_PACKS.includes(cycle.code)) {
      return pack;
    }
    return cycle;
  }

  let setString = displayPackName(cycleOrPack(cycle, pack));
  if (placeholderOptions.set.collectorsNumber) {
    setString += ` #${card.position}`;
  }
  if (placeholderOptions.set.parentheses) {
    setString = surroundParentheses(setString);
  }
  if (placeholderOptions.set.small) {
    setString = surroundHtmlTag(setString, "span", { class: "small" });
  }
  if (placeholderOptions.set.spacingOnDisplay !== false) {
    setString = addSpacing(setString, placeholderOptions.set.spacingOnDisplay);
  }
  s = replacePlaceholderIfFound(s, "set", setString);

  s = replacePlaceholderIfFound(s, "name", nameSubnameLevelString);

  s = replacePlaceholderIfFound(s, "code", card.code);
  return s;
}
