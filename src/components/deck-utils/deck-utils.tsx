import { Suspense, lazy } from "react";

const LazyCostCurveChart = lazy(() => import("./cost-curve-chart"));

export function CardUtils() {
  return (
    <Suspense fallback={<div>LOADING</div>}>
      <LazyCostCurveChart />
    </Suspense>
  );
}
