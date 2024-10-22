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
  fontSize: 12,
  opacity: 0.8,
};

export const chartsTheme: VictoryThemeDefinition = {
  chart: {
    padding: { top: 10, right: 20, bottom: 20, left: 20 },
  },
  line: {
    animate: animateProps,
    style: {
      data: {
        stroke: "var(--nord-10)",
        strokeWidth: 2,
      },
    },
  },
  scatter: {
    style: {
      data: { fill: "var(--nord-10)" },
    },
  },
  axis: {
    style: {
      axis: { stroke: "var(--nord-2)", strokeWidth: 2 },
      grid: {
        stroke: "var(--nord-2)",
        strokeDasharray: "5, 15",
        strokeWidth: 1,
      },
      tickLabels: baseLabelStyles,
    },
  },
  tooltip: {
    pointerLength: 0,
    style: Object.assign(baseLabelStyles, {
      padding: 5,
    }),
    flyoutStyle: {
      fill: "var(--nord-1)",
      stroke: "var(--nord-2)",
      strokeWidth: 1,
    },
    flyoutPadding: 5,
    flyoutHeight: 30,
    flyoutWidth: 60,
  },
};
