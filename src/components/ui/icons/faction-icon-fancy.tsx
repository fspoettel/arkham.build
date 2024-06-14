import memoize from "@/utils/memoize";
import SvgClassGuardian from "@/assets/icons/class_guardian.svg?react";
import SvgClassMystic from "@/assets/icons/class_mystic.svg?react";
import SvgClassNeutral from "@/assets/icons/class_neutral.svg?react";
import SvgClassRogue from "@/assets/icons/class_rogue.svg?react";
import SvgClassSeeker from "@/assets/icons/class_seeker.svg?react";
import SvgClassSurvivor from "@/assets/icons/class_survivor.svg?react";
import SvgMulticlass from "@/assets/icons/multiclass.svg?react";
import SvgAutoFail from "@/assets/icons/auto_fail.svg?react";

type Props = {
  className?: string;
  code: string;
};

const getIconFancy = memoize((code: string) => {
  switch (code) {
    case "guardian": {
      return SvgClassGuardian;
    }

    case "mystic": {
      return SvgClassMystic;
    }

    case "seeker": {
      return SvgClassSeeker;
    }

    case "rogue": {
      return SvgClassRogue;
    }

    case "neutral": {
      return SvgClassNeutral;
    }

    case "multiclass": {
      return SvgMulticlass;
    }

    case "survivor": {
      return SvgClassSurvivor;
    }

    case "mythos": {
      return SvgAutoFail;
    }

    default: {
      return null;
    }
  }
});

export function FactionIconFancy({ className, code }: Props) {
  const Icon = getIconFancy(code);
  return Icon ? <Icon className={className} /> : null;
}
