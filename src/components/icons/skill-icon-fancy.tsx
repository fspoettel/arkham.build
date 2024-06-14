import clsx from "clsx";

import SvgSkillAgility from "@/assets/icons/skill_agility.svg?react";
import SvgSkillAgilityInverted from "@/assets/icons/skill_agility_inverted.svg?react";
import SvgSkillCombat from "@/assets/icons/skill_combat.svg?react";
import SvgSkillCombatInverted from "@/assets/icons/skill_combat_inverted.svg?react";
import SvgSkillIntellect from "@/assets/icons/skill_intellect.svg?react";
import SvgSkillIntellectInverted from "@/assets/icons/skill_intellect_inverted.svg?react";
import SvgSkillWild from "@/assets/icons/skill_wild.svg?react";
import SvgSkillWildInverted from "@/assets/icons/skill_wild_inverted.svg?react";
import SvgSkillWillpower from "@/assets/icons/skill_willpower.svg?react";
import SvgSkillWillpowerInverted from "@/assets/icons/skill_willpower_inverted.svg?react";
import memoize from "@/utils/memoize";

import css from "./skill-icon-fancy.module.css";

const getSkillIcon = memoize((key: string) => {
  switch (key) {
    case "agility":
      return SvgSkillAgility;

    case "combat":
      return SvgSkillCombat;

    case "intellect":
      return SvgSkillIntellect;

    case "willpower":
      return SvgSkillWillpower;

    case "wild":
      return SvgSkillWild;

    default:
      return null;
  }
});

const getSkillIconInverted = memoize((key: string) => {
  switch (key) {
    case "agility":
      return SvgSkillAgilityInverted;

    case "combat":
      return SvgSkillCombatInverted;

    case "intellect":
      return SvgSkillIntellectInverted;

    case "willpower":
      return SvgSkillWillpowerInverted;

    case "wild":
      return SvgSkillWildInverted;

    default:
      return null;
  }
});

type Props = {
  className?: string;
  skill: string;
};

export function SkillIconFancy({ className, skill }: Props) {
  const Icon = getSkillIcon(skill);
  const Inverted = getSkillIconInverted(skill);
  return Icon ? (
    <span className={clsx(css["skill-icon_fancy"], css[skill], className)}>
      <Icon />
      {Inverted && <Inverted className={css["skill-icon_fancy-inverted"]} />}
    </span>
  ) : null;
}
