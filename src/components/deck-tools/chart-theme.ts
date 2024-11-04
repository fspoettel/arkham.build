import type { VictoryLabelStyleObject, VictoryThemeDefinition } from "victory";

const baseChartProps = {
  height: 250,
};

const baseLabelStyles: VictoryLabelStyleObject = {
  fontFamily: "var(--font-family-ui)",
  fill: "var(--palette-4)",
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
      axis: { stroke: "var(--palette-2)", strokeWidth: 2 },
      grid: {
        stroke: "var(--palette-2)",
        strokeDasharray: "5, 10",
        strokeWidth: 1,
      },
      tickLabels: { ...baseLabelStyles, padding: 10 },
    },
  },
  tooltip: {
    pointerLength: 0,
    style: baseLabelStyles,
    flyoutStyle: {
      fill: "var(--palette-1)",
      stroke: "var(--palette-2)",
      strokeWidth: 1,
    },
    flyoutPadding: { top: 12, bottom: 12, left: 6, right: 6 },
  },
  pie: {
    ...baseChartProps,
    padding: 0,
    style: {
      labels: {
        ...baseLabelStyles,
        padding: 4,
      },
      data: {
        stroke: "var(--palette-0)",
        strokeWidth: 2,
      },
    },
  },
  polarAxis: {
    ...baseChartProps,
    style: {
      axis: {
        fill: "transparent",
        stroke: "var(--palette-1)",
        strokeWidth: 2,
      },
      grid: {
        fill: "none",
        stroke: "var(--palette-2)",
        strokeDasharray: "5, 10",
      },
      tickLabels: {
        padding: 15,
      },
    },
  },
};
