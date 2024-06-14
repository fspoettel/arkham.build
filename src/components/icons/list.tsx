import type { SVGProps } from "react";
const SvgList = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="M6 6.2v1.6h2V6.2zm4 0v1.6h16V6.2zm-4 6v1.6h2v-1.6zm4 0v1.6h16v-1.6zm-4 6v1.6h2v-1.6zm4 0v1.6h16v-1.6zm-4 6v1.6h2v-1.6zm4 0v1.6h16v-1.6z" />
  </svg>
);
export default SvgList;
