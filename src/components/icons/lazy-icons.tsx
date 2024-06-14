/* eslint-disable react/display-name */
import React, { Suspense, memo } from "react";

import type { Props as EncounterIconProps } from "./encounter-icon";
import type { Props as PackIconProps } from "./pack-icon";
import type { Props as SlotIconProps } from "./slot-icon";

const EncounterIcon = React.lazy(() => import("./encounter-icon"));
const PackIcon = React.lazy(() => import("./pack-icon"));
const SlotIcon = React.lazy(() => import("./slot-icon"));

export const LazyEncounterIcon = memo((props: EncounterIconProps) => {
  return (
    <Suspense
      fallback={
        <span
          style={{ width: "1em", height: "1em", display: "inline-block" }}
        />
      }
    >
      <EncounterIcon {...props} />
    </Suspense>
  );
});

export const LazySlotIcon = memo((props: SlotIconProps) => {
  return (
    <Suspense
      fallback={
        <span
          style={{ width: "1em", height: "1em", display: "inline-block" }}
        />
      }
    >
      <SlotIcon {...props} />
    </Suspense>
  );
});

export const LazyPackIcon = memo((props: PackIconProps) => {
  return (
    <Suspense
      fallback={
        <span
          style={{ width: "1em", height: "1em", display: "inline-block" }}
        />
      }
    >
      <PackIcon {...props} />
    </Suspense>
  );
});
