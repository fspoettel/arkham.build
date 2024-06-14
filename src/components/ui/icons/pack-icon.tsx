import React, { Suspense } from "react";

export type Props = {
  className?: string;
  code?: string;
};

function PackIcon({ code, className }: Props) {
  const Icon = getPackIcon(code);

  return Icon ? (
    <Suspense
      fallback={
        <span
          style={{ width: "1em", height: "1em", display: "inline-block" }}
        />
      }
    >
      <Icon className={className} />
    </Suspense>
  ) : null;
}

function getPackIcon(code?: string) {
  switch (code) {
    case "side_stories":
    case "investigator":
    case "rcore":
    case "core":
    case "return":
      return React.lazy(() => import("@/assets/icons/core.svg?react"));

    case "parallel":
      return React.lazy(() => import("@/assets/icons/parallel.svg?react"));

    case "dwl":
      return React.lazy(() => import("@/assets/icons/set.svg?react"));

    case "ptc":
      return React.lazy(() => import("@/assets/icons/carcosa.svg?react"));

    case "tfa":
      return React.lazy(
        () => import("@/assets/icons/the_forgotten_age.svg?react"),
      );

    case "tcu":
      return React.lazy(
        () => import("@/assets/icons/the_circle_undone.svg?react"),
      );

    case "tde":
      return React.lazy(() => import("@/assets/icons/dream.svg?react"));

    case "tic":
      return React.lazy(() => import("@/assets/icons/tic.svg?react"));

    case "eoe":
    case "eoep":
      return React.lazy(() => import("@/assets/icons/eoe.svg?react"));

    case "eoec":
      return React.lazy(() => import("@/assets/icons/eoe_campaign.svg?react"));

    case "tskc":
      return React.lazy(() => import("@/assets/icons/tskc.svg?react"));

    case "tsk":
    case "tskp":
      return React.lazy(() => import("@/assets/icons/tsk.svg?react"));

    default:
      return null;
  }
}

export default PackIcon;
