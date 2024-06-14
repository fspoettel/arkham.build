import SvgLevel0Inverted from "@/assets/icons/inverted_level_0.svg?react";
import SvgLevel1Inverted from "@/assets/icons/inverted_level_1.svg?react";
import SvgLevel2Inverted from "@/assets/icons/inverted_level_2.svg?react";
import SvgLevel3Inverted from "@/assets/icons/inverted_level_3.svg?react";
import SvgLevel4Inverted from "@/assets/icons/inverted_level_4.svg?react";
import SvgLevel5Inverted from "@/assets/icons/inverted_level_5.svg?react";
import SvgLevelNoneInverted from "@/assets/icons/inverted_level_none.svg?react";
import SvgLevel0 from "@/assets/icons/level_0.svg?react";
import SvgLevel1 from "@/assets/icons/level_1.svg?react";
import SvgLevel2 from "@/assets/icons/level_2.svg?react";
import SvgLevel3 from "@/assets/icons/level_3.svg?react";
import SvgLevel4 from "@/assets/icons/level_4.svg?react";
import SvgLevel5 from "@/assets/icons/level_5.svg?react";
import SvgLevelNone from "@/assets/icons/level_none.svg?react";
import memoize from "@/utils/memoize";

type Props = {
  className?: string;
  level?: number;
  inverted?: boolean;
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

const getLevelIconInverted = memoize(
  (level: number | null | undefined | string) => {
    switch (level) {
      case 1:
        return SvgLevel1Inverted;

      case 2:
        return SvgLevel2Inverted;

      case 3:
        return SvgLevel3Inverted;

      case 4:
        return SvgLevel4Inverted;

      case 5:
        return SvgLevel5Inverted;

      case 0:
        return SvgLevel0Inverted;

      default: {
        return SvgLevelNoneInverted;
      }
    }
  },
);

export function LevelIcon({ className, inverted, level }: Props) {
  const Icon = inverted ? getLevelIconInverted(level) : getLevelIcon(level);
  return <Icon className={className} />;
}
