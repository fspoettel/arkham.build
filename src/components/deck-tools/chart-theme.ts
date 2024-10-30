import { MQ_FLOATING_SIDEBAR } from "@/utils/constants";
import type {
  AnimatePropTypeInterface,
  VictoryLabelStyleObject,
  VictoryThemeDefinition,
} from "victory";

const baseChartProps = {
  height: window.matchMedia(MQ_FLOATING_SIDEBAR).matches ? 200 : 250,
};

export const animateProps: AnimatePropTypeInterface = {
  duration: 550,
  easing: "expInOut",
  onLoad: { duration: 50 },
};

const baseLabelStyles: VictoryLabelStyleObject = {
  fontFamily: "var(--font-family-ui)",
  fill: "var(--nord-4)",
  fontSize: 12,
  lineHeight: 16,
};

export const chartsTheme: VictoryThemeDefinition = {
  chart: {
    ...baseChartProps,
    padding: 0,
  },
  line: {
    ...baseChartProps,
    style: {
      data: {
        stroke: "var(--nord-10)",
        strokeWidth: 2,
      },
    },
  },
  scatter: {
    ...baseChartProps,
    style: {
      data: { fill: "var(--nord-10)" },
    },
  },
  axis: {
    ...baseChartProps,
    style: {
      axisLabel: { ...baseLabelStyles, padding: 30 },
      axis: { stroke: "var(--nord-2)", strokeWidth: 2 },
      grid: {
        stroke: "var(--nord-2)",
        strokeDasharray: "5, 15",
        strokeWidth: 1,
      },
      tickLabels: { ...baseLabelStyles, padding: 10 },
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
  pie: {
    ...baseChartProps,
    padding: { bottom: 20 },
    style: {
      labels: {
        ...baseLabelStyles,
        fontSize: 10,
        padding: 10,
      },
      data: {
        stroke: "var(--nord-0)",
        strokeWidth: 2,
      },
    },
  },
};
