import type { AnimatePropTypeInterface, VictoryThemeDefinition } from "victory";
import "../../styles/main.css";

export const animateProps: AnimatePropTypeInterface = {
  duration: 550,
  easing: "expInOut",
  onLoad: { duration: 150 },
};

const baseObject = {
  animate: animateProps,
};

export const chartsTheme: VictoryThemeDefinition = {
  line: Object.assign({
    animate: animateProps,
    style: {
      data: {
        stroke: "var(--nord-11)",
      },
    },
    baseObject,
  }),
  axis: {
    style: {
      tickLabels: {
        fontFamily: "var(--font-family-ui)",
        fill: "var(--nord-4)",
      },
    },
  },
};
