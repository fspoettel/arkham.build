import { Suspense, lazy } from "react";

const LazyCostCurveChart = lazy(() => import("./cost-curve-chart"));

const VALUES = [
  { x: 0, y: 3 },
  { x: 1, y: 10 },
  { x: 2, y: 8 },
  { x: 3, y: 12 },
];

export function CardUtils() {
  return (
    <Suspense fallback={<div>LOADING</div>}>
      <LazyCostCurveChart values={VALUES} />
    </Suspense>
  );
}
