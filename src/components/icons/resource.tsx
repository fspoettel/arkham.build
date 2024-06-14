import type { SVGProps } from "react";
const SvgResource = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M15.988 3.116 4.65 8.613l.35.719v.003h-.8v13.834l11.45 5.55L16 28l.35.719 11.45-5.55V9H27l.331-.728zm.024 1.768L25.065 9l-9.075 4.125-9.056-3.841zm10.188 5.36v11.922l-9.4 4.559V14.516zm-20.4.297 9.4 3.991v12.194l-9.4-4.559zm17.519 2.371-6 9.666 1.363.844 6-9.666zm-3.985 1.979-2 3 1.331.887 2-3zm4 3-2 3 1.331.887 2-3z" />
  </svg>
);
export default SvgResource;
