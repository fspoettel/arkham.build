import React, { Suspense } from "react";
import { Props as EncounterIconProps } from "./encounter-icon";

const EncounterIcon = React.lazy(() => import("./encounter-icon"));

export function LazyEncounterIcon(props: EncounterIconProps) {
  return (
    <Suspense fallback={<div style={{ width: "1em", height: "1em" }} />}>
      <EncounterIcon {...props} />
    </Suspense>
  );
}
