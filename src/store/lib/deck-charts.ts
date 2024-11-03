import type { Card } from "../services/queries.types";
import type { DecksChartInfo, SkillIcon, UnformattedChartInfo } from "./types";

const FACTION_LOOKUP = {
  guardian: 0,
  seeker: 1,
  rogue: 2,
  mystic: 3,
  survivor: 4,
  neutral: 5,
};

const ICONS_LOOKUP = {
  skill_agility: 0,
  skill_combat: 0,
  skill_intellect: 0,
  skill_willpower: 0,
  skill_wild: 0,
};

export function getCardChartableData(
  card: Card,
  quantity: number,
  accumulator: DecksChartInfo,
) {
  // Cost curve
  if (typeof card.cost === "number") {
    const { cost } = card;

    // Group very high cost cards together
    const finalCost = cost > 6 ? 7 : cost;
    if (!accumulator.costCurve[finalCost])
      accumulator.costCurve[finalCost] = { x: finalCost, y: 0 };
    accumulator.costCurve[finalCost].y += quantity;
  }

  // Skill icons
  for (const skill of Object.keys(accumulator.skillIcons)) {
    accumulator.skillIcons[skill as SkillIcon] +=
      (card[skill as SkillIcon] ?? 0) * quantity;
  }

  accumulator.factions[
    card.faction_code as keyof UnformattedChartInfo["factions"]
  ]++;

  if (card.faction2_code)
    accumulator.factions[
      card.faction2_code as keyof UnformattedChartInfo["factions"]
    ]++;
  if (card.faction3_code)
    accumulator.factions[
      card.faction3_code as keyof UnformattedChartInfo["factions"]
    ]++;
}
