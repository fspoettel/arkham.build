import memoize from "lodash.memoize";
import SvgLevel0 from "../icons/level-0";
import SvgLevel1 from "../icons/level-1";
import SvgLevel2 from "../icons/level-2";
import SvgLevel3 from "../icons/level-3";
import SvgLevel5 from "../icons/level-5";
import SvgLevel4 from "../icons/level-4";

type Props = {
  className?: string;
  level?: number;
};

const getLevelIcon = memoize((level: number | null | undefined | string) => {
  switch (level) {
    case 1:
      return SvgLevel1;

    case 2:
      return SvgLevel2;

    case 3:
      return SvgLevel3;

    case 4:
      return SvgLevel4;

    case 5:
      return SvgLevel5;

    default:
      return SvgLevel0;
  }
});

export function LevelIcon({ className, level }: Props) {
  const Icon = getLevelIcon(level);
  return <Icon className={className} />;
}
