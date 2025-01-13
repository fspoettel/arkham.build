import { RETURN_TO_CYCLES } from "./constants";

export const CAMPAIGN_PLAYALONG_PACKS = [
  "core",
  "rcore",
  "rtnotz",
  "nat",
  "har",
  "win",
  "jac",
  "ste",
];

export function campaignPlayalongPacks(cycle: string) {
  const packs = [];
  if (cycle !== "core") packs.push(`${cycle}p`);

  if (RETURN_TO_CYCLES[cycle]) packs.push(RETURN_TO_CYCLES[cycle]);

  packs.push(...CAMPAIGN_PLAYALONG_PACKS);

  return packs;
}
