import memoize from "@/utils/memoize";
import SvgLevel0 from "@/assets/icons/level_0.svg?react";
import SvgLevel1 from "@/assets/icons/level_1.svg?react";
import SvgLevel2 from "@/assets/icons/level_2.svg?react";
import SvgLevel3 from "@/assets/icons/level_3.svg?react";
import SvgLevel5 from "@/assets/icons/level_5.svg?react";
import SvgLevel4 from "@/assets/icons/level_4.svg?react";
import SvgLevelNone from "@/assets/icons/level_none.svg?react";

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

    case 0:
      return SvgLevel0;

    default: {
      return SvgLevelNone;
    }
  }
});

export function LevelIcon({ className, level }: Props) {
  const Icon = getLevelIcon(level);
  return <Icon className={className} />;
}
