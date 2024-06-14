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
  code: string;
  fancy?: boolean;
};

const getSimpleIconDefinitions: () => Record<string, React.ComponentType> =
  memoize(() => ({
    guardian: SvgGuardian,
    mystic: SvgMystic,
    seeker: SvgSeeker,
    rogue: SvgRogue,
    neutral: SvgNeutral,
    survivor: SvgSurvivor,
  }));

const getFancyIconDefinitions: () => Record<string, React.ComponentType> =
  memoize(() => ({
    guardian: SvgClassGuardian,
    mystic: SvgClassMystic,
    seeker: SvgClassSeeker,
    rogue: SvgClassRogue,
    neutral: SvgClassNeutral,
    multiclass: SvgMulticlass,
    survivor: SvgClassSurvivor,
  }));

export function FactionIcon({ code, fancy }: Props) {
  const definitions = fancy
    ? getFancyIconDefinitions()
    : getSimpleIconDefinitions();
  const Icon = definitions[code];
  if (!Icon) return null;
  return <Icon />;
}
