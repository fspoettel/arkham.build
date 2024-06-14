import memoize from "@/utils/memoize";
import SvgSkillAgilityInverted from "@/assets/icons/skill_agility_inverted.svg?react";
import SvgSkillCombatInverted from "@/assets/icons/skill_combat_inverted.svg?react";
import SvgSkillIntellectInverted from "@/assets/icons/skill_intellect_inverted.svg?react";
import SvgSkillWillpowerInverted from "@/assets/icons/skill_willpower_inverted.svg?react";
import SvgSkillWildInverted from "@/assets/icons/skill_wild_inverted.svg?react";

const getSkillIcon = memoize((key: string) => {
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
  skill: string; // TODO: typecheck
};

export function SkillIcon({ className, skill }: Props) {
  const Icon = getSkillIcon(skill);
  return Icon ? <Icon className={className} /> : null;
}
