import type { SVGProps } from "react";
const SvgPlusButton = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M15.2 6v9.2H6v1.6h9.2V26h1.6v-9.2H26v-1.6h-9.2V6z" />
  </svg>
);
export default SvgPlusButton;
