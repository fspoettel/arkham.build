import type { Card } from "../services/queries.types";
import {
  type DecksChartInfo,
  FACTION_NAME,
  type FactionName,
  type SkillIcon,
} from "./types";

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
  for (const skill of accumulator.skillIcons) {
    const skillName = skill.x as SkillIcon;
    if (card[skillName]) skill.y += card[skillName];
  }

  // Factions
  accumulator.factions[FACTION_NAME.indexOf(card.faction_code as FactionName)]
    .y++;
  if (card.faction2_code) {
    accumulator.factions[
      FACTION_NAME.indexOf(card.faction2_code as FactionName)
    ].y++;
  }
  if (card.faction3_code) {
    accumulator.factions[
      FACTION_NAME.indexOf(card.faction3_code as FactionName)
    ].y++;
  }
}
