import memoize from "lodash.memoize";
import SvgNum0 from "../icons/num0";
import SvgNum1 from "../icons/num1";
import SvgNum2 from "../icons/num2";
import SvgNum3 from "../icons/num3";
import SvgNum4 from "../icons/num4";
import SvgNum5 from "../icons/num5";
import SvgNum6 from "../icons/num6";
import SvgNum7 from "../icons/num7";
import SvgNum8 from "../icons/num8";
import SvgNum9 from "../icons/num9";
import SvgX from "../icons/x";
import SvgNumNull from "../icons/num-null";

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
