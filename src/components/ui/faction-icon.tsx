import SvgClassGuardian from "@/components/icons/class-guardian";
import SvgClassMystic from "@/components/icons/class-mystic";
import SvgClassNeutral from "@/components/icons/class-neutral";
import SvgClassRogue from "@/components/icons/class-rogue";
import SvgClassSeeker from "@/components/icons/class-seeker";
import SvgClassSurvivor from "@/components/icons/class-survivor";
import SvgGuardian from "@/components/icons/guardian";
import SvgMulticlass from "@/components/icons/multiclass";
import SvgMystic from "@/components/icons/mystic";
import SvgNeutral from "@/components/icons/neutral";
import SvgRogue from "@/components/icons/rogue";
import SvgSeeker from "@/components/icons/seeker";
import SvgSurvivor from "@/components/icons/survivor";
import memoize from "lodash.memoize";

type Props = {
  className?: string;
  code: string;
  fancy?: boolean;
};

const getIconSimple = memoize((code: string) => {
  switch (code) {
    case "guardian": {
      return SvgGuardian;
    }

    case "mystic": {
      return SvgMystic;
    }

    case "seeker": {
      return SvgSeeker;
    }

    case "rogue": {
      return SvgRogue;
    }

    case "multiclass": {
      return SvgMulticlass;
    }

    case "neutral": {
      return SvgNeutral;
    }

    case "survivor": {
      return SvgSurvivor;
    }

    default: {
      return null;
    }
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

    default: {
      return null;
    }
  }
});

export function FactionIcon({ className, code, fancy }: Props) {
  const Icon = fancy ? getIconFancy(code) : getIconSimple(code);
  return Icon ? <Icon className={className} /> : null;
}
