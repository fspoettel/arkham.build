import memoize from "@/utils/memoize";
import SvgClassGuardian from "@/assets/icons/class_guardian.svg?react";
import SvgClassMystic from "@/assets/icons/class_mystic.svg?react";
import SvgClassNeutral from "@/assets/icons/class_neutral.svg?react";
import SvgClassRogue from "@/assets/icons/class_rogue.svg?react";
import SvgClassSeeker from "@/assets/icons/class_seeker.svg?react";
import SvgClassSurvivor from "@/assets/icons/class_survivor.svg?react";
import SvgGuardian from "@/assets/icons/guardian.svg?react";
import SvgMulticlass from "@/assets/icons/multiclass.svg?react";
import SvgMystic from "@/assets/icons/mystic.svg?react";
import SvgNeutral from "@/assets/icons/neutral.svg?react";
import SvgRogue from "@/assets/icons/rogue.svg?react";
import SvgSeeker from "@/assets/icons/seeker.svg?react";
import SvgSurvivor from "@/assets/icons/survivor.svg?react";
import SvgAutoFail from "@/assets/icons/auto_fail.svg?react";

type Props = {
  className?: string;
  code: string;
  fancy?: boolean;
};

const getIconSimple = memoize((code: string) => {
  switch (code) {
    case "guardian":
      return SvgGuardian;

    case "mystic":
      return SvgMystic;

    case "seeker":
      return SvgSeeker;

    case "rogue":
      return SvgRogue;

    case "multiclass":
      return SvgMulticlass;

    case "neutral":
      return SvgNeutral;

    case "survivor":
      return SvgSurvivor;

    case "mythos": {
      return SvgAutoFail;
    }

    default:
      return null;
  }
});

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

export function FactionIcon({ className, code, fancy }: Props) {
  const Icon = fancy ? getIconFancy(code) : getIconSimple(code);
  return Icon ? <Icon className={className} /> : null;
}
