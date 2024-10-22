import type {
  AnimatePropTypeInterface,
  VictoryLabelStyleObject,
  VictoryThemeDefinition,
} from "victory";

export const animateProps: AnimatePropTypeInterface = {
  duration: 550,
  easing: "expInOut",
  onLoad: { duration: 150 },
};

const baseLabelStyles: VictoryLabelStyleObject = {
  fontFamily: "var(--font-family-ui)",
  fill: "var(--nord-4)",
  fontSize: "8px",
  opacity: 0.8,
};

export const chartsTheme: VictoryThemeDefinition = {
  chart: {
    padding: 15,
  },
  line: {
    animate: animateProps,
    style: {
      data: {
        stroke: "var(--nord-10)",
      },
    },
  },
  axis: {
    style: {
      tickLabels: baseLabelStyles,
    },
  },
};
