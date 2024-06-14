import type { SVGProps } from "react";
const SvgMinusButton = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M6 15.2v1.6h20v-1.6z" />
  </svg>
);
export default SvgMinusButton;
