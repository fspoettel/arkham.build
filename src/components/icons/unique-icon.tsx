import type { SVGProps } from "react";

export function UniqueIcon(props: SVGProps<SVGSVGElement>) {
  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: not relevant.
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-264 -264 528 528"
    >
      <path d="M-39.418-95.164 0-254.905l39.418 159.74 140.827-85.08-85.08 140.827L254.904 0 95.165 39.418l85.08 140.827-140.827-85.08L0 254.904l-39.418-159.74-140.827 85.08 85.08-140.827L-254.904 0l159.74-39.418-85.08-140.827z" />
    </svg>
  );
}
