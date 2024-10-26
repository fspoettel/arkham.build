import type {
  AnimatePropTypeInterface,
  VictoryLabelStyleObject,
  VictoryThemeDefinition,
} from "victory";

export const animateProps: AnimatePropTypeInterface = {
  duration: 550,
  easing: "expInOut",
  onLoad: { duration: 50 },
};

const baseLabelStyles: VictoryLabelStyleObject = {
  fontFamily: "var(--font-family-ui)",
  fill: "var(--nord-4)",
  fontSize: 12,
  opacity: 0.8,
  lineHeight: 16,
};

export const chartsTheme: VictoryThemeDefinition = {
  chart: {
    padding: { top: 10, right: 10, bottom: 40, left: 45 },
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
      axisLabel: { ...baseLabelStyles, padding: 25 },
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
      padding: 20,
    }),
    flyoutStyle: {
      fill: "var(--nord-1)",
      stroke: "var(--nord-2)",
      strokeWidth: 1,
    },
    flyoutPadding: 5,
    flyoutWidth: 75,
  },
};
