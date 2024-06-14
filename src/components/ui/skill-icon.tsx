import memoize from "lodash.memoize";
import SvgSkillAgilityInverted from "../icons/skill-agility-inverted";
import SvgSkillCombatInverted from "../icons/skill-combat-inverted";
import SvgSkillIntellectInverted from "../icons/skill-intellect-inverted";
import SvgSkillWillpowerInverted from "../icons/skill-willpower-inverted";
import SvgSkillWildInverted from "../icons/skill-wild-inverted";

const getSkillIcon = memoize((key: string) => {
  switch (key) {
    case "agility": {
      return SvgSkillAgilityInverted;
    }

    case "combat": {
      return SvgSkillCombatInverted;
    }

    case "intellect": {
      return SvgSkillIntellectInverted;
    }

    case "willpower": {
      return SvgSkillWillpowerInverted;
    }

    case "wild": {
      return SvgSkillWildInverted;
    }

    default: {
      return null;
    }
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
