import type { SVGProps } from "react";
const SvgRightArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 32 32"
    className="icon"
    {...props}
  >
    <path d="m12.707 5.293-1.414 1.414L20.586 16l-9.293 9.293 1.414 1.414L23.414 16z" />
  </svg>
);
export default SvgRightArrow;
