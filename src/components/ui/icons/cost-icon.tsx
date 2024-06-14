import SvgNum0 from "@/assets/icons/num0.svg?react";
import SvgNum1 from "@/assets/icons/num1.svg?react";
import SvgNum2 from "@/assets/icons/num2.svg?react";
import SvgNum3 from "@/assets/icons/num3.svg?react";
import SvgNum4 from "@/assets/icons/num4.svg?react";
import SvgNum5 from "@/assets/icons/num5.svg?react";
import SvgNum6 from "@/assets/icons/num6.svg?react";
import SvgNum7 from "@/assets/icons/num7.svg?react";
import SvgNum8 from "@/assets/icons/num8.svg?react";
import SvgNum9 from "@/assets/icons/num9.svg?react";
import SvgNumNull from "@/assets/icons/numNull.svg?react";
import SvgX from "@/assets/icons/x.svg?react";
import memoize from "@/utils/memoize";

// TODO: where is the star icon used?
const getCostIcon = memoize((cost?: string | number | null) => {
  switch (cost?.toString()) {
    case "0": {
      return SvgNum0;
    }

    case "1": {
      return SvgNum1;
    }

    case "2": {
      return SvgNum2;
    }

    case "3": {
      return SvgNum3;
    }

    case "4": {
      return SvgNum4;
    }

    case "5": {
      return SvgNum5;
    }

    case "6": {
      return SvgNum6;
    }

    case "7": {
      return SvgNum7;
    }

    case "8": {
      return SvgNum8;
    }

    case "9": {
      return SvgNum9;
    }

    case "-2": {
      return SvgX;
    }

    default: {
      return SvgNumNull;
    }
  }
});

type Props = {
  className?: string;
  cost?: string | number | null;
};

export function CostIcon({ className, cost }: Props) {
  const Icon = getCostIcon(cost);
  return Icon ? <Icon className={className} /> : null;
}
