import type { SVGProps } from "react";
const SvgPlusThin = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M15.2 0v15.2H0v1.6h15.2V32h1.6V16.8H32v-1.6H16.8V0z" />
  </svg>
);
export default SvgPlusThin;
