import type { SVGProps } from "react";
const SvgMenu = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M6 8.2v1.6h20V8.2zm0 7v1.6h20v-1.6zm0 7v1.6h20v-1.6z" />
  </svg>
);
export default SvgMenu;
