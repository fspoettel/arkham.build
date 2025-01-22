import {
  FACTION_ORDER,
  type FactionName,
  type SkillIcon,
} from "@/utils/constants";
import type { Card } from "../services/queries.types";
import type { DeckCharts } from "./types";

export function emptyDeckCharts(): DeckCharts {
  return {
    costCurve: [],
    skillIcons: [
      { x: "skill_agility", y: 0 },
      { x: "skill_combat", y: 0 },
      { x: "skill_intellect", y: 0 },
      { x: "skill_willpower", y: 0 },
      { x: "skill_wild", y: 0 },
    ],
    factions: [
      { x: "guardian", y: 0 },
      { x: "seeker", y: 0 },
      { x: "rogue", y: 0 },
      { x: "mystic", y: 0 },
      { x: "survivor", y: 0 },
      { x: "neutral", y: 0 },
      // even though mythos cards should not be part of the deck, some arkhamdb decks contain them.
      // we should at least not crash when this happens.
      { x: "mythos", y: 0 },
    ],
  };
}

export function addCardToDeckCharts(
  card: Card,
  quantity: number,
  accumulator: DeckCharts,
) {
  // Cost curve
  if (typeof card.cost === "number" && card.cost !== -2) {
    const { cost } = card;

    // Group very high cost cards together
    const finalCost = cost > 6 ? 7 : cost;
    accumulator.costCurve[finalCost] ??= { x: finalCost, y: 0 };
    accumulator.costCurve[finalCost].y += quantity;
  }

  // Skill icons
  for (const skill of accumulator.skillIcons) {
    const skillName = skill.x as SkillIcon;
    if (card[skillName]) skill.y += card[skillName] * quantity;
  }

  // Factions

  accumulator.factions[
    FACTION_ORDER.indexOf(card.faction_code as FactionName)
  ].y += quantity;

  if (card.faction2_code) {
    accumulator.factions[
      FACTION_ORDER.indexOf(card.faction2_code as FactionName)
    ].y += quantity;
  }

  if (card.faction3_code) {
    accumulator.factions[
      FACTION_ORDER.indexOf(card.faction3_code as FactionName)
    ].y += quantity;
  }
}
